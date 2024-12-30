import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SectionList from './SectionList';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  cursor: 'default',
};

const defaultDrawingOptions = {
  fillColor: '#4CAF50',
  fillOpacity: 0.3,
  strokeWeight: 2,
  strokeColor: '#4CAF50',
  editable: true,
  draggable: true,
  geodesic: true,
  clickable: true,
  zIndex: 1,
};

const MapManager = ({ initialCenter, onPolygonComplete, sections, setSections }) => {
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [pendingSection, setPendingSection] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewArea, setPreviewArea] = useState(null);

  const handleNewPolygon = useCallback(
    (polygon) => {
      try {
        console.log('New polygon created:', polygon);
        // Convert polygon path to array of lat/lng objects
        const path = polygon.getPath().getArray().map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

        // Calculate area in square feet
        const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
        const areaInSqFt = Math.round(area * 10.7639);

        // Create new section object
        const newSection = {
          id: Date.now().toString(),
          path,
          area: areaInSqFt,
          color: '#4CAF50',
        };

        setPendingSection(newSection);
        setNewSectionLabel(`Section ${sections.length + 1}`);
        setLabelDialogOpen(true);
        setIsDrawing(false);
        setPreviewArea(null);

        // Remove the temporary polygon
        polygon.setMap(null);

        // Reset drawing mode
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setDrawingMode(null);
        }
      } catch (error) {
        console.error('Error creating polygon:', error);
        polygon?.setMap(null);
      }
    },
    [sections.length]
  );

  const handleDrawingManagerLoad = useCallback((drawingManager) => {
    console.log('Drawing manager loaded:', drawingManager);
    drawingManagerRef.current = drawingManager;

    // Add listener for drawing mode changes
    window.google.maps.event.addListener(drawingManager, 'drawingmode_changed', () => {
      const mode = drawingManager.getDrawingMode();
      console.log('Drawing mode changed:', mode);
      const isPolygonMode = mode === window.google.maps.drawing.OverlayType.POLYGON;
      setIsDrawing(isPolygonMode);
      
      // Update cursor style based on mode
      if (mapRef.current) {
        mapRef.current.setOptions({
          draggableCursor: isPolygonMode ? 'crosshair' : 'default',
        });
      }

      if (!mode) {
        setPreviewArea(null);
      }
    });

    // Add listener for polygon vertex changes
    window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      console.log('Overlay complete:', event);
      if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay;
        handleNewPolygon(polygon);
        
        // Add listeners for vertex changes
        window.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
          const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
          setPreviewArea(Math.round(area * 10.7639));
        });
        
        window.google.maps.event.addListener(polygon.getPath(), 'remove_at', () => {
          const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
          setPreviewArea(Math.round(area * 10.7639));
        });
        
        window.google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
          const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
          setPreviewArea(Math.round(area * 10.7639));
        });
      }
    });
  }, [handleNewPolygon]);

  const handleMapLoad = useCallback((map) => {
    console.log('Map loaded');
    mapRef.current = map;
  }, []);

  const startDrawing = useCallback(() => {
    console.log('Starting drawing mode');
    if (!drawingManagerRef.current) {
      // Create new drawing manager if it doesn't exist
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        polygonOptions: defaultDrawingOptions,
        map: mapRef.current,
      });
      handleDrawingManagerLoad(drawingManager);
    } else {
      // Use existing drawing manager
      drawingManagerRef.current.setMap(mapRef.current);
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      setIsDrawing(true);
    }
  }, [handleDrawingManagerLoad]);

  const stopDrawing = useCallback(() => {
    console.log('Stopping drawing mode');
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setMap(null); // Remove drawing manager from map
      setIsDrawing(false);
      setPreviewArea(null);
      
      // Reset cursor style
      if (mapRef.current) {
        mapRef.current.setOptions({
          draggableCursor: 'default',
        });
      }
    }
  }, []);

  const handleLabelConfirm = useCallback(() => {
    if (pendingSection && newSectionLabel.trim()) {
      const finalSection = {
        ...pendingSection,
        label: newSectionLabel.trim(),
      };
      setSections((prev) => [...prev, finalSection]);
      onPolygonComplete(finalSection);
      setLabelDialogOpen(false);
      setPendingSection(null);
      setNewSectionLabel('');
    }
  }, [pendingSection, newSectionLabel, setSections, onPolygonComplete]);

  const handleEditSection = useCallback((section) => {
    // TODO: Implement section editing
    console.log('Edit section:', section);
  }, []);

  const handleDeleteSection = useCallback((sectionId) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  }, [setSections]);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {isDrawing && previewArea && `Current area: ${previewArea.toLocaleString()} sq ft`}
          {isDrawing && !previewArea && 'Click on the map to start drawing a section'}
          {!isDrawing && 'Click "Draw Section" to begin'}
        </Typography>
        {!isDrawing ? (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={startDrawing} 
            startIcon={<CreateIcon />}
          >
            Draw Section
          </Button>
        ) : (
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={stopDrawing}
          >
            Cancel Drawing
          </Button>
        )}
      </Box>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCenter}
        zoom={20}
        onLoad={handleMapLoad}
        options={{
          mapTypeId: 'satellite',
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: window.google.maps.ControlPosition.TOP_RIGHT,
            style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['satellite', 'roadmap'],
          },
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          scrollwheel: true,
          rotateControl: false,
          tilt: 0,
        }}
      >
        {sections.map((section) => (
          <Polygon
            key={section.id}
            paths={section.path}
            options={{
              ...defaultDrawingOptions,
              fillOpacity: 0.4,
              strokeColor: '#000',
              editable: false,
              draggable: false,
            }}
            onClick={() => handleEditSection(section)}
          />
        ))}
      </GoogleMap>

      <SectionList
        sections={sections}
        onEdit={handleEditSection}
        onDelete={handleDeleteSection}
      />

      <Dialog open={labelDialogOpen} onClose={() => setLabelDialogOpen(false)}>
        <DialogTitle>Name Your Lawn Section</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Area: {pendingSection?.area.toLocaleString()} sq ft
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            fullWidth
            value={newSectionLabel}
            onChange={(e) => setNewSectionLabel(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLabelConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLabelConfirm} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MapManager; 