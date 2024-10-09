// OnboardingStep2.tsx
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, MenuItem } from '@mui/material';

interface OnboardingStep2Props {
    onNext: (lawnSize: string, grassType: string) => void;
    onPrevious: () => void;
}

const grassTypes = [
    { value: 'Bermuda', label: 'Bermuda' },
    { value: 'Fescue', label: 'Fescue' },
    { value: 'Zoysia', label: 'Zoysia' },
    { value: 'Ryegrass', label: 'Ryegrass' },
    { value: 'Kentucky Bluegrass', label: 'Kentucky Bluegrass' },
];

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onPrevious }) => {
    const [lawnSize, setLawnSize] = useState<string>('');
    const [grassType, setGrassType] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleNext = () => {
        if (lawnSize && grassType) {
            onNext(lawnSize, grassType);
        } else {
            setError('Please fill in all required fields.');
        }
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
                <Typography variant="h5">Step 2: Lawn Size and Grass Type</Typography>
            </Grid>
            <Grid item>
                <TextField
                    label="Lawn Size (sq ft)"
                    variant="outlined"
                    fullWidth
                    value={lawnSize}
                    onChange={(e) => setLawnSize(e.target.value)}
                    placeholder="Enter lawn size"
                    required
                    type="number"
                />
            </Grid>
            <Grid item>
                <TextField
                    select
                    label="Grass Type"
                    variant="outlined"
                    fullWidth
                    value={grassType}
                    onChange={(e) => setGrassType(e.target.value)}
                    placeholder="Select your grass type"
                    required
                >
                    {grassTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            {error && (
                <Grid item>
                    <Typography color="error">{error}</Typography>
                </Grid>
            )}
            <Grid item>
                <Button variant="contained" color="secondary" onClick={onPrevious} style={{ marginRight: '10px' }}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!lawnSize || !grassType}
                >
                    Next
                </Button>
            </Grid>
        </Grid>
    );
};

export default OnboardingStep2;
