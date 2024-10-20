import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, Button } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import backgroundImage from '../../assets/LawnSenseiHero.png';

const Welcome = () => {
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const handleGetStarted = () => {
    navigate('/onboarding/address');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <animated.div style={fadeIn}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
            Welcome to Lawn Sensei
          </Typography>
        </animated.div>
        <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, color: 'white' }}>
          Your personal lawn care consultant, ready to help you achieve the perfect lawn.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          sx={{
            mt: 4,
            px: 4,
            py: 1.5,
            fontSize: '1.2rem',
            borderRadius: '30px',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5,
            },
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Welcome;