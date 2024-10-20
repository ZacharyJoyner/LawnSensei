import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Container, Box, List, ListItem, ListItemIcon, ListItemText, Paper, Alert, CircularProgress, Button } from '@mui/material';
import { Grass as GrassIcon } from '@mui/icons-material';
import { useOnboarding } from '../context/OnboardingContext';

const LawnRecommendations = React.memo(() => {
  const { onboardingData } = useOnboarding();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations.');
      }
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onboardingData]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lawn Care Recommendations
        </Typography>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button onClick={fetchRecommendations} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            {recommendations.length > 0 ? (
              <List>
                {recommendations.map((rec) => (
                  <ListItem key={rec.id}>
                    <ListItemIcon>
                      <GrassIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec.title} secondary={rec.description} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No recommendations available at this time.</Typography>
            )}
          </Paper>
        )}
        <Button onClick={fetchRecommendations} sx={{ mt: 2 }}>
          Refresh Recommendations
        </Button>
      </Box>
    </Container>
  );
});

export default LawnRecommendations;
