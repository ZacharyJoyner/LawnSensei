import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';

const AccountCreation = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const navigate = useNavigate();
  const [email, setEmail] = useState(onboardingData.email || '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(onboardingData.displayName || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setError(null);
    if (!email || !password || !displayName) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      updateOnboardingData({ email, displayName });

      navigate('/onboarding-summary'); // Navigate to summary
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create Your Account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box>
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            aria-label="Display Name"
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            aria-label="Email Address"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            aria-label="Password"
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreateAccount} disabled={loading} aria-label="Create Account">
          {loading ? <CircularProgress size={24} /> : 'Create Account'}
        </Button>
      </Box>
    </Container>
  );
};

export default AccountCreation;
