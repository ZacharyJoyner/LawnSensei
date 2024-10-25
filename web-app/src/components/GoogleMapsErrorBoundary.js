import React from 'react';
import { Alert, Button } from '@mui/material';

class GoogleMapsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert 
          severity="error"
          action={
            <Button color="inherit" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          Failed to load map components. Please refresh the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default GoogleMapsErrorBoundary;
