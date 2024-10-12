import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const LawnPlanForm = () => {
  const [address, setAddress] = useState('');
  const [wateringPreference, setWateringPreference] = useState('');

  const onSubmit = async () => {
    const token = 'YOUR_AUTH_TOKEN_HERE'; // Replace with the actual token

    try {
      const res = await axios.post(
        'http://localhost:5000/api/lawn-plans',
        { address, wateringPreference },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Success', 'Lawn care plan created successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Error creating lawn care plan');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Address:</Text>
      <TextInput
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Text>Watering Preference:</Text>
      <TextInput
        value={wateringPreference}
        onChangeText={(text) => setWateringPreference(text)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Create Lawn Care Plan" onPress={onSubmit} />
    </View>
  );
};

export default LawnPlanForm;
