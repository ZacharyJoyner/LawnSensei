import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const LawnDashboard = () => {
  const [lawnPlans, setLawnPlans] = useState([]);

  useEffect(() => {
    const fetchLawnPlans = async () => {
      const token = 'YOUR_AUTH_TOKEN_HERE'; // Replace with actual token

      try {
        const res = await axios.get('http://localhost:5000/api/lawn-plans', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setLawnPlans(res.data);
      } catch (err) {
        console.error('Error fetching lawn plans:', err);
      }
    };

    fetchLawnPlans();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Lawn Care Plan Dashboard</Text>
      {lawnPlans.length > 0 ? (
        lawnPlans.map((plan) => (
          <View key={plan._id} style={styles.planCard}>
            <Text>Grass Type: {plan.grassType}</Text>
            <Text>Lawn Area: {plan.lawnArea} sq ft</Text>
            <Text>Weather: {plan.weather}</Text>
            <Text>Watering Preference: {plan.wateringPreference}</Text>
          </View>
        ))
      ) : (
        <Text>No lawn care plans found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  planCard: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default LawnDashboard;
