import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LawnPlanForm from '../components/LawnPlanForm';
import LawnAreaCalculator from '../components/LawnAreaCalculator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="LawnPlanForm" component={LawnPlanForm} />
        <Stack.Screen name="LawnAreaCalculator" component={LawnAreaCalculator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
