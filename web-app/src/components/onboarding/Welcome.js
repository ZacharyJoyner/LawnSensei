import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import backgroundImage from '../../assets/LawnSenseiHero.png'; // Ensure this image exists

const Welcome = () => {
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const handleGetStarted = () => {
    navigate('/enter-address');
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
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
            Welcome to Lawn Sensei
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mt: 2 }}>
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
            aria-label="Get Started"
          >
            Get Started
          </Button>
        </animated.div>
      </Container>
    </Box>
  );
};

export default Welcome;
