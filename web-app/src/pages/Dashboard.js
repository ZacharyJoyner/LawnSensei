import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lawn Sensei Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Welcome to Your Lawn Dashboard
              </Typography>
              <Typography>
                Here you&apos;ll be able to manage your lawn care plans and track your progress.
              </Typography>
            </Paper>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Create New Plan
              </Button>
              <Button variant="outlined" color="primary">
                View Tasks
              </Button>
            </Paper>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            </Paper>
          </Grid>
          
          {/* Lawn Status */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Lawn Status
              </Typography>
              <Typography variant="body1">
                Start by creating your first lawn care plan to see status and recommendations here.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 