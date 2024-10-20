import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const LawnAreaCalculator = () => {
  const [region, setRegion] = useState(null);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [area, setArea] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleMapPress = (e) => {
    setPolygonCoords([...polygonCoords, e.nativeEvent.coordinate]);
  };

  const calculateArea = () => {
    if (polygonCoords.length < 3) {
      alert('Please select at least 3 points to calculate area');
      return;
    }

    // Simple polygon area calculation (for demonstration purposes)
    let area = 0;
    for (let i = 0; i < polygonCoords.length; i++) {
      let j = (i + 1) % polygonCoords.length;
      area += polygonCoords[i].latitude * polygonCoords[j].longitude;
      area -= polygonCoords[j].latitude * polygonCoords[i].longitude;
    }
    area = Math.abs(area / 2);

    // Convert to square feet (rough approximation)
    const areaInSqFt = area * 10.7639 * 1000000;
    setArea(areaInSqFt.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lawn Area Calculator</Text>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {polygonCoords.length > 0 && (
            <Polygon
              coordinates={polygonCoords}
              fillColor="rgba(0, 200, 0, 0.5)"
              strokeColor="rgba(0, 200, 0, 0.8)"
            />
          )}
        </MapView>
      )}
      <TouchableOpacity style={styles.button} onPress={calculateArea}>
        <Text style={styles.buttonText}>Calculate Area</Text>
      </TouchableOpacity>
      {area > 0 && (
        <Text style={styles.areaText}>Lawn Area: {area} sq ft</Text>
      )}
    </View>
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
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
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
  areaText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LawnAreaCalculator;
