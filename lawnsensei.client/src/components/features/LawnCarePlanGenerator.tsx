import React from 'react';

interface LawnCarePlanProps {
    lawnSize: string;
    grassType: string;
    climateZone: string;
}

const LawnCarePlanGenerator: React.FC<LawnCarePlanProps> = ({ lawnSize, grassType, climateZone }) => {
    // Simple logic to generate a sample lawn care plan
    const generateCarePlan = () => {
        if (grassType === 'Bermuda') {
            return 'Water twice weekly and fertilize once a month during the growing season.';
        } else if (grassType === 'Fescue') {
            return 'Water weekly and fertilize in early spring and fall.';
        } else {
            return 'Provide 1 inch of water per week and fertilize in early spring.';
        }
    };

    return (
        <div>
            <h2>Your Lawn Care Plan</h2>
            <p><strong>Lawn Size:</strong> {lawnSize} sq ft</p>
            <p><strong>Grass Type:</strong> {grassType}</p>
            <p><strong>Climate Zone:</strong> {climateZone}</p>
            <h3>Recommended Care Plan:</h3>
            <p>{generateCarePlan()}</p>
        </div>
    );
};

export default LawnCarePlanGenerator;
