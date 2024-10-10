import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Grid, Button, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OnboardingSummaryProps {
    lawnSize: string;
    address: string;
    grassType: string;
    climateZone: string;
}

const OnboardingSummary: React.FC = () => {
    const [summaryData, setSummaryData] = useState<OnboardingSummaryProps | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOnboardingData = async () => {
            try {
                const response = await axios.get('/api/OnboardingData');
                setSummaryData(response.data);
            } catch (error) {
                console.error('Error fetching onboarding data:', error);
                alert('There was an error fetching your onboarding data. Please try again.');
            }
        };

        fetchOnboardingData();
    }, []);

    const handleFinish = () => {
        alert('Onboarding Complete! Your data has been saved.');
        navigate('/dashboard');
    };

    if (!summaryData) {
        return <Typography>Loading...</Typography>;
    }

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
                                <strong>Address:</strong> {summaryData.address}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Climate Zone:</strong> {summaryData.climateZone}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Lawn Size:</strong> {summaryData.lawnSize} sq ft
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>Grass Type:</strong> {summaryData.grassType}
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