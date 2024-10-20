import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, DrawingManager, Polygon } from '@react-google-maps/api';
import { useOnboarding } from '../context/OnboardingContext';

const MapComponent = ({ address }) => {
  const { onboardingData } = useOnboarding();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [propertyBoundary, setPropertyBoundary] = useState(null);
  const [sections, setSections] = useState(onboardingData.sections || []);
  const mapRef = useRef(null);

  useEffect(() => {
    if (address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          setCenter(results[0].geometry.location.toJSON());
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }, [address]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    // Additional map configurations can be added here
  }, []);

  const onBoundaryComplete = useCallback((polygon) => {
    const path = polygon.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
    setPropertyBoundary(path);
    const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
    // You can handle the area or other properties here
    polygon.setMap(null); // Remove the polygon from the map
  }, []);

  const onSectionComplete = useCallback((polygon) => {
    const path = polygon.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
    const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
    const newSection = {
      id: Date.now().toString(),
      path: path,
      label: `Section ${sections.length + 1}`,
      area: Math.round(area * 10.764), // Convert to square feet
    };
    setSections(prevSections => [...prevSections, newSection]);
    // Update the onboarding context with the new section
    // Assuming you have a method to update sections in the context
    updateOnboardingData({ sections: [...sections, newSection] });
    polygon.setMap(null); // Remove the polygon from the map
  }, [sections, updateOnboardingData]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={center}
        zoom={18}
        onLoad={onMapLoad}
        mapTypeId="satellite"
      >
        <DrawingManager
          onPolygonComplete={propertyBoundary ? onSectionComplete : onBoundaryComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ['polygon'],
            },
            polygonOptions: {
              fillColor: '#2196F3',
              fillOpacity: 0.2,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            },
          }}
        />
        {propertyBoundary && (
          <Polygon
            paths={propertyBoundary}
            options={{
              fillColor: '#00FF00',
              fillOpacity: 0.35,
              strokeColor: '#0000FF',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
              draggable: true,
            }}
          />
        )}
        {sections.map((section) => (
          <Polygon
            key={section.id}
            paths={section.path}
            options={{
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
              draggable: true,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;