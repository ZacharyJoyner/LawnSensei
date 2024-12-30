import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import SignIn from '../components/auth/SignIn';
import heroImage from '../assets/LawnSenseiHero.png';

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the onboarding welcome page
    navigate('/onboarding');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Sign In Link */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1,
        }}
      >
        <Button
          variant="text"
          onClick={() => setShowSignIn(true)}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          Sign In
        </Button>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          Welcome to Lawn Sensei
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          Your personal lawn care consultant, ready to help you achieve the perfect lawn.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': {
              backgroundColor: '#1b5e20',
            },
            padding: '12px 48px',
            fontSize: '1.2rem',
          }}
        >
          GET STARTED
        </Button>
      </Container>

      {/* Sign In Dialog */}
      <Dialog
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setShowSignIn(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <SignIn />
        </Box>
      </Dialog>
    </Box>
  );
};

export default LandingPage; 