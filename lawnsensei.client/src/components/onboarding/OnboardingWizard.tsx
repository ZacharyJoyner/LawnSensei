// OnboardingWizard.tsx
import React, { useState } from 'react';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingSummary from './OnboardingSummary';
import { Stepper, Step, StepLabel, Button, Container } from '@mui/material';

const OnboardingWizard: React.FC = () => {
    const [step, setStep] = useState<number>(0);
    const [lawnSize, setLawnSize] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [grassType, setGrassType] = useState<string>('');
    const [climateZone, setClimateZone] = useState<string>('');

    const steps = ['Lawn Details', 'Lawn Size and Type', 'Summary'];

    const goToNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const goToPreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleStep1Next = (address: string, climateZone: string) => {
        setAddress(address);
        setClimateZone(climateZone);
        goToNextStep();
    };

    const handleStep2Next = (lawnSize: string, grassType: string) => {
        setLawnSize(lawnSize);
        setGrassType(grassType);
        goToNextStep();
    };

    return (
        <Container maxWidth="sm">
            <Stepper activeStep={step} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {step === 0 && (
                <OnboardingStep1
                    onNext={(address, climateZone) => handleStep1Next(address, climateZone)}
                />
            )}
            {step === 1 && (
                <OnboardingStep2
                    onNext={(lawnSize, grassType) => handleStep2Next(lawnSize, grassType)}
                    onPrevious={goToPreviousStep}
                />
            )}
            {step === 2 && (
                <OnboardingSummary
                    lawnSize={lawnSize}
                    address={address}
                    grassType={grassType}
                    climateZone={climateZone}
                />
            )}

            <div style={{ marginTop: '20px' }}>
                {step > 0 && step < steps.length - 1 && (
                    <Button variant="contained" color="secondary" onClick={goToPreviousStep} style={{ marginRight: '10px' }}>
                        Back
                    </Button>
                )}
                {step < steps.length - 1 && (
                    <Button variant="contained" color="primary" onClick={goToNextStep} disabled={step === 0 && (!address || !climateZone)}>
                        Next
                    </Button>
                )}
            </div>
        </Container>
    );
};

export default OnboardingWizard;