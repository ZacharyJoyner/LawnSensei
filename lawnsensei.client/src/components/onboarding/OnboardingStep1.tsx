// OnboardingStep1.tsx
import React, { useState } from 'react';
import { getUserLocation, getAddressFromCoordinates, getClimateZone } from '../../services/locationService';
import { TextField, Button, Grid, Typography } from '@mui/material';

interface OnboardingStep1Props {
    onNext: (address: string, climateZone: string) => void;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext }) => {
    const [address, setAddress] = useState<string>('');
    const [climateZone, setClimateZone] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleUseMyLocation = async () => {
        try {
            // Get user's geolocation
            const { latitude, longitude } = await getUserLocation();

            // Get the address from coordinates
            const userAddress = await getAddressFromCoordinates(latitude, longitude);
            setAddress(userAddress);

            // Determine the climate zone based on latitude
            const zone = getClimateZone(latitude);
            setClimateZone(zone);
            setError('');
        } catch (error) {
            setError('Unable to retrieve your location. Please enter manually.');
        }
    };

    const handleNext = () => {
        if (address && climateZone) {
            onNext(address, climateZone);
        } else {
            setError('Please fill in all required fields.');
        }
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
                <Typography variant="h5">Step 1: Lawn Details</Typography>
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={handleUseMyLocation}>
                    Use My Location
                </Button>
            </Grid>
            <Grid item>
                <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    required
                />
            </Grid>
            <Grid item>
                <TextField
                    label="Climate Zone"
                    variant="outlined"
                    fullWidth
                    value={climateZone}
                    placeholder="Detected Climate Zone"
                    InputProps={{ readOnly: true }}
                    required
                />
            </Grid>
            {error && (
                <Grid item>
                    <Typography color="error">{error}</Typography>
                </Grid>
            )}
            <Grid item>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!address || !climateZone}
                >
                    Next
                </Button>
            </Grid>
        </Grid>
    );
};

export default OnboardingStep1;