import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LawnCareInsights = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // Implement insights logic here if needed
    navigate('/account-creation');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Lawn Care Insights
        </Typography>
        <Typography variant="body1" gutterBottom>
          Based on your preferences, here are some insights to help you maintain your lawn effectively.
        </Typography>
        {/* Add insights details here */}
        <Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 3 }} aria-label="Next Insights">
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default LawnCareInsights;
