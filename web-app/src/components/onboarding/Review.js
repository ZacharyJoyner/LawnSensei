import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  LocationOn,
  Grass,
  CheckCircle,
  Edit,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useOnboarding } from '../../context/OnboardingContext';

// Future enhancements:
// 1. Add CardActions for "Learn More" functionality in Next Steps
// 2. Use Dividers to separate sections within Property Overview
// 3. Add interactive elements to each next step
// 4. Include progress indicators for setup completion

const Review = () => {
  const navigate = useNavigate();
  const { onboardingData } = useOnboarding();

  const handleBack = () => {
    navigate('/onboarding/property');
  };

  const handleNext = () => {
    navigate('/onboarding/account');
  };

  const handleEditSections = () => {
    navigate('/onboarding/sections');
  };

  // Calculate total lawn area
  const totalArea = onboardingData.sections?.reduce((sum, section) => sum + section.area, 0) || 0;

  if (!onboardingData.address || !onboardingData.sections?.length) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom color="error">
            Please complete the previous steps first
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/onboarding')}
            startIcon={<ArrowBack />}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          Review Your Lawn Plan
        </Typography>

        {/* Property Overview Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Property Address</Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                {onboardingData.address}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Grass color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Lawn Area</Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {totalArea.toLocaleString()} sq ft
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sections Created</Typography>
              </Box>
              <List dense>
                {onboardingData.sections.map((section, index) => (
                  <ListItem key={section.id}>
                    <ListItemIcon>
                      <Grass color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={section.label}
                      secondary={`${section.area.toLocaleString()} sq ft`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              onClick={handleEditSections}
            >
              Edit Sections
            </Button>
          </Box>
        </Paper>

        {/* Next Steps Card */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Next Steps
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Personalized Lawn Care Plan"
                  secondary="We'll create a customized plan based on your lawn sections"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Section-Specific Recommendations"
                  secondary="Get tailored advice for each area of your lawn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Maintenance Schedule"
                  secondary="Access your personalized lawn care calendar"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': {
                bgcolor: '#1b5e20',
              },
            }}
          >
            Complete Setup
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Review;
