import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Stoperica from './Stoperica.js'
import Pocetna from './pocetna.js';


export default class App extends React.Component {
  render() {
    return (
      <View style={{flex:1}}>
     <Stoperica></Stoperica>
      </View>
    );
  }
}

