import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lawn Sensei Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your lawn care dashboard. Here you&apos;ll find your lawn plans, recommendations, and more.
        </Typography>
        {/* Add more dashboard content here */}
      </Box>
    </Container>
  );
};

export default Dashboard;
