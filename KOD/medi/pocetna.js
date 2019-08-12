import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Stoperica from './Stoperica.js';


import Icon from 'react-native-vector-icons/Entypo';

import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

export default class pocetna extends React.Component {
  render() {
    return <AppStackNavigator />;
  }
}


const AppStackNavigator = createAppContainer(
  createBottomTabNavigator({
   
    Stopwatch: {
      screen: Stoperica,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="stopwatch" size={30} />,
      }
    }
    
  },
    {
    tabBarOptions:{
      activeTintColor:'black',
      tabColor:'black'
    }}
  )
);
