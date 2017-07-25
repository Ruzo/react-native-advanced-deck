import React, { Component } from 'react';
import {
    Animated,
    View,
    PanResponder,
    Dimensions
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends Component {
    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY();

    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderMove: (evt, gesture) => {
                this.position.setValue({ x: gesture.dx, y: 0 });
            },
            onPanResponderRelease: () => {
                Animated.spring(this.position, { toValue: {x: 0, y: 0} }).start();
            },
        });
    }

    getLayout(){
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            outputRange: ['-90deg', '0deg', '90deg']
        });
        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        }
    }

    renderCards(){
        return this.props.data.map( (card, index) =>{
            if(index === 0){
                return (
                    <Animated.View
                        key = { card.id }
                        {...this._panResponder.panHandlers}
                        style = {this.getLayout()}
                    >
                        { this.props.renderCard(card) }
                    </Animated.View>
                )
            }
            return this.props.renderCard(card);
        }
        );
    }

    render() {
        return (
            <View>
                { this.renderCards() }
            </View>
        );
    }
}

export default Deck;