import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, DrawingManager } from '@react-google-maps/api';
import { computeArea } from 'spherical-geometry-js';

const libraries = ['drawing'];
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 40.73061, // Example coordinates for New York City
  lng: -73.935242,
};

const MapComponent = ({ isAreaCalculator }) => {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries,
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handlePolygonComplete = useCallback((polygon) => {
    const path = polygon.getPath().getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    setPolygonCoords(path);

    // Calculate and log the area of the polygon
    const area = computeArea(polygon.getPath());
    console.log('Polygon Area:', area, 'square meters');
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
    >
      {isAreaCalculator && (
        <DrawingManager
          onPolygonComplete={handlePolygonComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ['polygon'],
            },
            polygonOptions: {
              fillColor: '#2196F3',
              fillOpacity: 0.5,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: false,
            },
          }}
        />
      )}
      {polygonCoords.length > 0 && (
        <Polygon
          paths={polygonCoords}
          options={{
            fillColor: '#2196F3',
            fillOpacity: 0.4,
            strokeColor: '#000',
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;