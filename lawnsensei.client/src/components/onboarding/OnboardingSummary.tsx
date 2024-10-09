// OnboardingSummary.tsx
import React from 'react';
import { Typography, Card, CardContent, Grid, Button, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OnboardingSummaryProps {
    lawnSize: string;
    address: string;
    grassType: string;
    climateZone: string;
}

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({ lawnSize, address, grassType, climateZone }) => {
    const navigate = useNavigate();

    const handleFinish = async () => {
        try {
            const onboardingData = {
                lawnSize,
                address,
                grassType,
                climateZone,
            };

            // Make a POST request to save onboarding data
            const response = await axios.post('/api/OnboardingData', onboardingData);
            if (response.status === 201) {
                alert('Onboarding Complete! Your data has been saved.');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            alert('There was an error saving your data. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Card variant="outlined" style={{ marginTop: '20px' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Onboarding Summary
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Address:</strong> {address}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Climate Zone:</strong> {climateZone}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Lawn Size:</strong> {lawnSize} sq ft
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Grass Type:</strong> {grassType}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleFinish}>
                        Finish
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OnboardingSummary;