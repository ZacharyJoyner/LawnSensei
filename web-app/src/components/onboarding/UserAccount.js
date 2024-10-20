import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const UserAccount = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [email, setEmail] = useState(onboardingData.email || '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(onboardingData.displayName || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      handleNext();
      navigate('/recommendations'); // Navigate to Lawn Recommendations
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
        <TextField
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          aria-label="Display Name"
          helperText="Enter a name to display on your account."
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
          helperText="We'll never share your email with anyone else."
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
          helperText="Choose a strong password."
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={handleBack} aria-label="Back">
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreateAccount} disabled={loading} aria-label="Create Account">
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserAccount;
