import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnboardingStep2: React.FC = () => {
    const [grassType, setGrassType] = useState('');
    const [climateZone, setClimateZone] = useState('');
    const navigate = useNavigate();

    const handleNext = async () => {
        if (!grassType || !climateZone) {
            alert('Please fill in all fields before proceeding.');
            return;
        }

        try {
            const onboardingData = {
                grassType,
                climateZone,
            };

            // Make a POST request to save onboarding data
            await axios.post('/api/OnboardingData', onboardingData);

            // Navigate to the next step
            navigate('/onboarding/summary');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            alert('There was an error saving your data. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Step 2: Lawn and Climate Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="grass-type-label">Grass Type</InputLabel>
                        <Select
                            labelId="grass-type-label"
                            value={grassType}
                            onChange={(e) => setGrassType(e.target.value)}
                            label="Grass Type"
                        >
                            <MenuItem value="Bermuda">Bermuda</MenuItem>
                            <MenuItem value="Fescue">Fescue</MenuItem>
                            <MenuItem value="Kentucky Bluegrass">Kentucky Bluegrass</MenuItem>
                            <MenuItem value="Zoysia">Zoysia</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Climate Zone"
                        variant="outlined"
                        fullWidth
                        value={climateZone}
                        onChange={(e) => setClimateZone(e.target.value)}
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

export default OnboardingStep2;