import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import LawnPlanForm from './components/LawnPlanForm';
import LawnDashboard from './components/LawnDashboard';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <LawnPlanForm />
      <LawnDashboard /> 
    </View>
  );
}

export default function App() {
  return <AppNavigator />;
}