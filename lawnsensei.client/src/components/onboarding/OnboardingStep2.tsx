// OnboardingStep2.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingStep2: React.FC = () => {
    const [grassType, setGrassType] = useState<string>('');
    const [climateZone, setClimateZone] = useState<string>('');
    const navigate = useNavigate();

    const handleNext = () => {
        // Ideally, save this data to local state or context
        navigate('/onboarding/summary'); // Navigate to the onboarding summary step
    };

    return (
        <div>
            <h2>Onboarding - Step 2</h2>
            <p>Tell us more about your lawn to create a customized care plan.</p>
            <label>
                Grass Type:
                <select value={grassType} onChange={(e) => setGrassType(e.target.value)}>
                    <option value="">Select Grass Type</option>
                    <option value="Cool Season">Cool Season</option>
                    <option value="Warm Season">Warm Season</option>
                </select>
            </label>
            <br />
            <label>
                Climate Zone:
                <select value={climateZone} onChange={(e) => setClimateZone(e.target.value)}>
                    <option value="">Select Climate Zone</option>
                    <option value="Tropical">Tropical</option>
                    <option value="Subtropical">Subtropical</option>
                    <option value="Temperate">Temperate</option>
                    <option value="Continental">Continental</option>
                    <option value="Polar">Polar</option>
                </select>
            </label>
            <br />
            <button onClick={handleNext}>Next</button>
        </div>
    );
};

export default OnboardingStep2;
