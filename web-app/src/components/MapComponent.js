import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, DrawingManager } from '@react-google-maps/api';
import { computeArea } from 'spherical-geometry-js';

const libraries = ['drawing']; // Keep this outside of the component to prevent unnecessary reloads
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 40.73061, // New York City coordinates for example
  lng: -73.935242,
};

const MapComponent = ({ setLawnArea, setCoordinates }) => {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const mapRef = useRef(null);

  // Use the Google Maps JavaScript API loader hook
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey, // Use environment variable here
    libraries: libraries,
  });

  // Define hooks outside of any conditional block to adhere to hook rules
  const onLoadPolygon = useCallback((polygon) => {
    const path = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
    }
    setPolygonCoords(coordinates);
    setCoordinates(coordinates); // Save coordinates to pass to backend
  }, [setCoordinates]);

  const onPolygonComplete = useCallback((polygon) => {
    const path = polygon.getPath();
    const coordinates = [];
    let area = 0;

    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
    }

    // Calculate area of the polygon using `computeArea`
    area = computeArea(path);
    setPolygonCoords(coordinates);
    setCoordinates(coordinates);
    setLawnArea(area);
  }, [setLawnArea, setCoordinates]);

  // Loading and error handling
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={(map) => (mapRef.current = map)}
    >
      <DrawingManager
        onPolygonComplete={onPolygonComplete}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            drawingModes: ['polygon'],
          },
        }}
      />
      {polygonCoords.length > 0 && (
        <Polygon
          path={polygonCoords}
          options={{
            fillColor: 'lightblue',
            strokeColor: 'blue',
            strokeWeight: 2,
            fillOpacity: 0.4,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
