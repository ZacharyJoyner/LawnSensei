import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { useOnboarding } from '../../context/OnboardingContext';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import useOnboardingProgress from '../../hooks/useOnboardingProgress';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const { clearProgress } = useOnboardingProgress();

  // Check for saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('lawn_sensei_onboarding_progress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        updateOnboardingData(parsedProgress);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [updateOnboardingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user makes changes
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store user info in localStorage
      const userData = {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Update onboarding data with user information
      updateOnboardingData({
        user: userData,
      });

      // Determine where to navigate based on onboarding progress
      if (onboardingData.sections?.length > 0 && onboardingData.address) {
        // User has completed onboarding, navigate to dashboard
        navigate('/dashboard');
      } else if (onboardingData.address) {
        // User has started but not completed onboarding
        navigate('/onboarding/property');
      } else {
        // User hasn't started onboarding
        clearProgress(); // Clear any partial progress
        navigate('/onboarding');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        default:
          setError('Failed to sign in. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card elevation={3} sx={{ mt: 8 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#2e7d32', fontWeight: 'bold' }}>
              Sign In to Lawn Sensei
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!error && error.includes('email')}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!error && error.includes('password')}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  bgcolor: '#2e7d32',
                  '&:hover': {
                    bgcolor: '#1b5e20',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{' '}
                  <Button 
                    color="primary" 
                    onClick={() => navigate('/onboarding')}
                    disabled={loading}
                  >
                    Start Setup
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignIn; 