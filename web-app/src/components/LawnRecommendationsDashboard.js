import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Container, Box, Typography, CircularProgress, Alert, Paper, Chip, Grid, Button } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useOnboarding } from '../context/OnboardingContext';

const localizer = momentLocalizer(moment);

const LawnRecommendationsDashboard = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);
  const { onboardingData } = useOnboarding();

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggestions`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchSuggestions(), fetchTasks()]);
    } catch (error) {
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [fetchSuggestions, fetchTasks]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const taskEvents = tasks.map(task => ({
      title: task.name,
      start: new Date(task.date),
      end: new Date(task.date),
      allDay: true,
    }));
    setEvents(taskEvents);
  }, [tasks]);

  const handleTaskComplete = async (taskId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, { completed: true });
      fetchTasks(); // Refresh tasks after updating
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Personalized Lawn Care Dashboard
        </Typography>
        <Grid container spacing={4}>
          {/* Lawn Care Suggestions */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Lawn Care Suggestions
              </Typography>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <Box key={suggestion.id} sx={{ mb: 2 }}>
                    <Chip label={suggestion.name} color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2">{suggestion.description}</Typography>
                    {suggestion.buyLink && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        href={suggestion.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1 }}
                      >
                        Buy Now
                      </Button>
                    )}
                  </Box>
                ))
              ) : (
                <Typography>No suggestions available at this time.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Scheduled Tasks */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Scheduled Tasks
              </Typography>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <Box key={task._id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Button
                      variant={task.completed ? 'contained' : 'outlined'}
                      color={task.completed ? 'success' : 'primary'}
                      onClick={() => handleTaskComplete(task._id)}
                      sx={{ mr: 2 }}
                      aria-label={`Mark task ${task.name} as complete`}
                    >
                      {task.completed ? 'Completed' : 'Complete'}
                    </Button>
                    <Typography variant="body1" sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.name}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No tasks scheduled.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Calendar View */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Calendar View
              </Typography>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.allDay ? '#4CAF50' : '#2196F3',
                    color: 'white',
                  },
                })}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LawnRecommendationsDashboard;
