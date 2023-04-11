import React from 'react';


// load navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


// bottom tabs navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// load Component
import RecommendScreen from './screens/RecommendScreen';
import MocktestScreen from "./screens/MocktestScreen";
import TypeScreen from "./screens/TypeScreen";
import WrongScreen from "./screens/WrongScreen";
import InfoScreen from "./screens/InfoScreen";

import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import StudyScreen from "./screens/StudyScreen";
import MockStudyScreen from "./screens/MockStudyScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const Home = () =>{
    return (
      <Tab.Navigator>
          <Tab.Screen name = "Recommend" component = {RecommendScreen}/>
          <Tab.Screen name = "Mocktest" component = {MocktestScreen}/>
          <Tab.Screen name = "Type" component = {TypeScreen}/>   
          <Tab.Screen name = "Wrong" component = {WrongScreen}/>
          <Tab.Screen name = "Info" component = {InfoScreen}/>
      </Tab.Navigator>
    );
}


const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Signin'>
          <Stack.Screen name = "Home" component = {Home}/>
          <Stack.Screen name = "Signin" component = {SigninScreen}/>
          <Stack.Screen name = "Signup" component = {SignupScreen}/>
          <Stack.Screen name = "Study" component = {StudyScreen}/>
          <Stack.Screen name="MockStudy" component = {MockStudyScreen}/>
        </Stack.Navigator>

      </NavigationContainer>    
  );
}


export default App;
