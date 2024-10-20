import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const LawnDashboard = () => {
  const [lawnPlans, setLawnPlans] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLawnPlans();
    fetchRecommendations();
  }, []);

  const fetchLawnPlans = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.API_URL}/lawn-plans`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setLawnPlans(res.data);
    } catch (err) {
      console.error('Error fetching lawn plans:', err);
    }
  };

  const fetchRecommendations = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.API_URL}/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setRecommendations(res.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Lawn Care Dashboard</Text>
      {lawnPlans.map((plan) => (
        <View key={plan._id} style={styles.planCard}>
          <Text style={styles.planTitle}>{plan.name}</Text>
          <Text>Grass Type: {plan.grassType}</Text>
          <Text>Lawn Area: {plan.lawnArea} sq ft</Text>
          <Text>Watering Preference: {plan.wateringPreference}</Text>
        </View>
      ))}
      <Text style={styles.sectionHeader}>Recommendations</Text>
      {recommendations.map((rec, index) => (
        <View key={index} style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>{rec.title}</Text>
          <Text>{rec.description}</Text>
        </View>
      ))}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('LawnPlanForm')}
      >
        <Text style={styles.buttonText}>Create New Lawn Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  planCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recommendationCard: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LawnDashboard;
