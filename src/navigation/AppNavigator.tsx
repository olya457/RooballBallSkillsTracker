import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {DisclaimerScreen} from '../screens/DisclaimerScreen';
import {MainTabs} from '../screens/MainTabs';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {SplashScreen} from '../screens/SplashScreen';
import type {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);
