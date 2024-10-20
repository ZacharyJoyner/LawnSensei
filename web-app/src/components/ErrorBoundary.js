import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details if needed
    console.error('Error Boundary Caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Container maxWidth="sm">
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Something went wrong.
            </Typography>
            <Typography variant="body1" gutterBottom>
              An unexpected error occurred. Please try reloading the page.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload} sx={{ mt: 2 }}>
              Reload Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;