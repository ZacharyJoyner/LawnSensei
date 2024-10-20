import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LawnPlanForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    grassType: '',
    lawnArea: '',
    wateringPreference: '',
    soilType: '',
    sunExposure: '',
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${process.env.API_URL}/lawn-plans`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Lawn care plan created successfully!');
      navigation.navigate('LawnDashboard');
    } catch (err) {
      console.error(err);
      alert('Error creating lawn care plan');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Lawn Care Plan</Text>
      <TextInput
        style={styles.input}
        placeholder="Plan Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
      />
      <Picker
        selectedValue={formData.grassType}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('grassType', itemValue)}
      >
        <Picker.Item label="Select Grass Type" value="" />
        <Picker.Item label="Bermuda" value="bermuda" />
        <Picker.Item label="Fescue" value="fescue" />
        <Picker.Item label="Kentucky Bluegrass" value="kentuckyBluegrass" />
        <Picker.Item label="St. Augustine" value="stAugustine" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Lawn Area (sq ft)"
        value={formData.lawnArea}
        onChangeText={(text) => handleChange('lawnArea', text)}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={formData.wateringPreference}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('wateringPreference', itemValue)}
      >
        <Picker.Item label="Select Watering Preference" value="" />
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>
      <Picker
        selectedValue={formData.soilType}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('soilType', itemValue)}
      >
        <Picker.Item label="Select Soil Type" value="" />
        <Picker.Item label="Sandy" value="sandy" />
        <Picker.Item label="Clay" value="clay" />
        <Picker.Item label="Loamy" value="loamy" />
      </Picker>
      <Picker
        selectedValue={formData.sunExposure}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('sunExposure', itemValue)}
      >
        <Picker.Item label="Select Sun Exposure" value="" />
        <Picker.Item label="Full Sun" value="fullSun" />
        <Picker.Item label="Partial Shade" value="partialShade" />
        <Picker.Item label="Full Shade" value="fullShade" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Lawn Care Plan</Text>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LawnPlanForm;
