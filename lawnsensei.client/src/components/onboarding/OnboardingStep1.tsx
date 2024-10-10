import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnboardingStep1: React.FC = () => {
    const [address, setAddress] = useState('');
    const [lawnSize, setLawnSize] = useState('');
    const navigate = useNavigate();

    const handleNext = async () => {
        if (!address || !lawnSize) {
            alert('Please fill in all fields before proceeding.');
            return;
        }

        try {
            const onboardingData = {
                address,
                lawnSize,
            };

            // Make a POST request to save onboarding data
            await axios.post('/api/OnboardingData', onboardingData);

            // Navigate to the next step
            navigate('/onboarding/step2');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            alert('There was an error saving your data. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Step 1: Basic Lawn Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Lawn Size (sq ft)"
                        variant="outlined"
                        fullWidth
                        value={lawnSize}
                        onChange={(e) => setLawnSize(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OnboardingStep1;