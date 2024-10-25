import React from 'react';
import { Alert, Button, Box } from '@mui/material';

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert 
            severity="error"
            action={
              <Button color="inherit" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            }
          >
            {this.state.error?.message || 'Error loading map components'}
            <br />
            Please check your internet connection and try again.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
