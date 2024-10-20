import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LawnDashboard from '../components/LawnDashboard';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LawnDashboard />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LawnPlanForm')}
        >
          <Text style={styles.buttonText}>Create New Lawn Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LawnAreaCalculator')}
        >
          <Text style={styles.buttonText}>Calculate Lawn Area</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
