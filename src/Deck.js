import React, { Component } from 'react';
import {
    Animated,
    View,
    PanResponder,
    Dimensions,
    NativeModules,
    LayoutAnimation,
    StyleSheet,
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESH = SCREEN_WIDTH * 0.25;

const { UIManager } = NativeModules;

class Deck extends Component {
    static defaultProps = {
        swipedRight: (card) => {},
        swipedLeft: (card) => {}
    }

    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY();

        this.state = {
            currentIndex: 0,
        };

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.data != this.props.data){
            this.setState({ currentIndex: 0 });
        }
    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderMove: (evt, gesture) => {
                this.position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (evt, gesture) => {
                gesture.dx > SWIPE_THRESH ? this.completeSwipe(+1)
                : gesture.dx < -SWIPE_THRESH ? this.completeSwipe(-1)
                : Animated.spring(this.position, { toValue: {x: 0, y: 0} }).start();
            },
        });
    }

    componentWillUpdate(){
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    completeSwipe(direction){
        Animated.timing(this.position, {
            toValue: { x: SCREEN_WIDTH * direction, y: 0 },
            duration: 250
        }).start(() => this.onSwipeCompleted(direction));
    }

    onSwipeCompleted(direction){
        const { swipedLeft, swipedRight, data } = this.props;
        const swipedIndex = this.state.currentIndex;
        this.position.setValue({ x: 0, y: 0});
        this.setState({ currentIndex: this.state.currentIndex + 1 });
        direction == 1 ? swipedRight(data[swipedIndex]) : swipedLeft(data[swipedIndex]);
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
        const { data, renderCard, renderNoMoreCards, loadCardsData } = this.props;
        if(this.state.currentIndex >= data.length) return renderNoMoreCards(loadCardsData);
        return data.map( (card, index) =>{
            if( index < this.state.currentIndex ) return null;

            if(index === this.state.currentIndex){
                return (
                    <Animated.View
                        key = { card.id }
                        {...this._panResponder.panHandlers}
                        style = {[this.getLayout(), styles.stack, { zIndex: 99 }]}
                    >
                        { renderCard(card) }
                    </Animated.View>
                )
            }
            return (
                <Animated.View
                    key = {card.id}
                    style={[
                        styles.stack,
                        { top: 10 * (index - this.state.currentIndex) },
                        { zIndex: -index} ]}
                >
                    {renderCard(card)}
                </Animated.View>
            )
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

const styles = StyleSheet.create({
    stack: {
        position: 'absolute',
        width: SCREEN_WIDTH,
    }
})