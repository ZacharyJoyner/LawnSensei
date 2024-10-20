import React from 'react';
import { Button, styled } from '@mui/material';
import { useSpring, animated } from 'react-spring';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Ripple = styled('span')({
  position: 'absolute',
  borderRadius: '50%',
  transform: 'scale(0)',
  animation: 'ripple 600ms linear',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '@keyframes ripple': {
    to: {
      transform: 'scale(4)',
      opacity: 0,
    },
  },
});

const GetStartedButton = ({ onClick }) => {
  const [springs, api] = useSpring(() => ({ scale: 1 }));

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;

    const rippleElement = event.currentTarget.appendChild(ripple);

    setTimeout(() => {
      rippleElement.remove();
    }, 600);

    api.start({ scale: 0.95 });
    setTimeout(() => api.start({ scale: 1 }), 200);

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <animated.div style={springs}>
      <StyledButton
        variant="contained"
        color="primary"
        size="large"
        onClick={handleClick}
      >
        Get Started
        <Ripple />
      </StyledButton>
    </animated.div>
  );
};

export default GetStartedButton;
