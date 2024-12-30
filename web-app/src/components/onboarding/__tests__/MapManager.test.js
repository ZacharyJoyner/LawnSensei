import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapManager from '../MapManager';

// Mock the Google Maps JavaScript API
const mockGoogleMaps = {
  maps: {
    drawing: {
      OverlayType: {
        POLYGON: 'polygon',
      },
    },
    ControlPosition: {
      TOP_RIGHT: 1,
    },
    MapTypeControlStyle: {
      DROPDOWN_MENU: 2,
    },
    geometry: {
      spherical: {
        computeArea: jest.fn(() => 100), // 100 square meters
      },
    },
  },
};

global.google = mockGoogleMaps;

// Mock the @react-google-maps/api components
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onLoad }) => {
    // Simulate map load
    React.useEffect(() => {
      onLoad({ setCenter: jest.fn() });
    }, [onLoad]);
    return <div data-testid="google-map">{children}</div>;
  },
  DrawingManager: ({ onLoad, onPolygonComplete }) => {
    // Simulate drawing manager load
    React.useEffect(() => {
      onLoad({
        setDrawingMode: jest.fn(),
      });
    }, [onLoad]);
    return <div data-testid="drawing-manager" />;
  },
  Polygon: ({ paths }) => <div data-testid="polygon" data-paths={JSON.stringify(paths)} />,
}));

describe('MapManager', () => {
  const mockProps = {
    initialCenter: { lat: 40.7128, lng: -74.006 },
    onPolygonComplete: jest.fn(),
    sections: [],
    setSections: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MapManager {...mockProps} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('shows Draw Section button when not drawing', () => {
    render(<MapManager {...mockProps} />);
    expect(screen.getByText('Draw Section')).toBeInTheDocument();
  });

  it('toggles drawing mode when Draw Section button is clicked', async () => {
    render(<MapManager {...mockProps} />);
    
    // Click Draw Section button
    fireEvent.click(screen.getByText('Draw Section'));
    
    // Should show Cancel Drawing button
    await waitFor(() => {
      expect(screen.getByText('Cancel Drawing')).toBeInTheDocument();
    });
    
    // Click Cancel Drawing button
    fireEvent.click(screen.getByText('Cancel Drawing'));
    
    // Should show Draw Section button again
    await waitFor(() => {
      expect(screen.getByText('Draw Section')).toBeInTheDocument();
    });
  });

  it('renders existing sections as polygons', () => {
    const sectionsWithData = [
      {
        id: '1',
        path: [{ lat: 40, lng: -74 }],
        label: 'Test Section',
        color: '#4CAF50',
      },
    ];

    render(<MapManager {...mockProps} sections={sectionsWithData} />);
    const polygon = screen.getByTestId('polygon');
    expect(polygon).toBeInTheDocument();
    expect(polygon).toHaveAttribute('data-paths', JSON.stringify(sectionsWithData[0].path));
  });

  it('displays section list when sections exist', () => {
    const sectionsWithData = [
      {
        id: '1',
        path: [{ lat: 40, lng: -74 }],
        label: 'Test Section',
        area: 1000,
        color: '#4CAF50',
      },
    ];

    render(<MapManager {...mockProps} sections={sectionsWithData} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Area: 1,000 sq ft')).toBeInTheDocument();
  });

  it('shows empty state message when no sections exist', () => {
    render(<MapManager {...mockProps} />);
    expect(screen.getByText(/No lawn sections created yet/)).toBeInTheDocument();
  });
}); 