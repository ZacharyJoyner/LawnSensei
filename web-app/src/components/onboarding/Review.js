import React, { useState } from 'react';
import { Typography, Button, Container, Box, List, ListItem, ListItemText, Paper, Alert } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';

const Review = ({ handleBack }) => { // Accept handleBack as a prop
  const { onboardingData } = useOnboarding();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      // Example API call - replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit onboarding data.');
      }

      setSubmitSuccess(true);
      // Optionally, navigate to the main dashboard or another page
      // Example: navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      setSubmitError(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Review Your Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Address" secondary={onboardingData.address} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Map Center" secondary={`Lat: ${onboardingData.mapCenter.lat}, Lng: ${onboardingData.mapCenter.lng}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Lawn Sections" secondary={`${onboardingData.sections ? onboardingData.sections.length : 0}`} />
            </ListItem>
            {/* Add more review items as needed */}
          </List>
        </Paper>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Onboarding completed successfully!
          </Alert>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleBack} variant="outlined" aria-label="Back">
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={submitSuccess}
            aria-label="Finish"
          >
            Finish
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Review;
