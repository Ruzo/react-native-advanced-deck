import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';

import Deck from './src/Deck';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      data: []
    };

    this.loadCardsData = this.loadCardsData.bind(this);
  }
  componentWillMount(){
    this.loadCardsData();
  }

  loadCardsData(){
    console.log("Loading cards' data...");
    let DATA = []
    for(i = 0; i < 8; i++){
      DATA[i] = {
        id: i + 1,
        text: `Card #${i + 1}`,
        uri: 'http://loremflickr.com/441/215/brazil?random='+(i+1)
      };
    }
    this.setState({ data: DATA });
  }

  renderCard(card){
    return (
        <Card
          key = { card.id }
          title = { card.text }
          image = {{ uri: card.uri }}
        >
          <Text style={{ marginBottom: 10 }}>Some card text goes here</Text>
          <Button
            icon = {{ name: 'code' }}
            backgroundColor = "#ccc"
            title="View Now!"
          />
        </Card>
    )
  }

  renderNoMoreCards(loadCardsFunc){
    return (
        <Card
          title = "All Done!"
          image = {{ uri: "https://unsplash.it/g/800/390/?blur" }}
        >
          <Text style={{ marginBottom: 10 }}>There are no cards left.</Text>
          <Button
            icon = {{ name: 'code' }}
            backgroundColor = "#ccc"
            title="More cards!"
            onPress={() => loadCardsFunc()}
          />
        </Card>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck
          renderCard={this.renderCard}
          renderNoMoreCards = {this.renderNoMoreCards}
          loadCardsData = { this.loadCardsData }
          data = {this.state.data}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    paddingTop: '25%'
  },
});
