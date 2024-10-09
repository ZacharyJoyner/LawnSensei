// Dashboard.tsx
import React, { useState } from 'react';

interface LawnPlan {
    type: string;
    tasks: string[];
}

const Dashboard: React.FC = () => {
    const [lawnSize, setLawnSize] = useState<string>('');
    const [grassType, setGrassType] = useState<string>('');
    const [lawnPlan, setLawnPlan] = useState<LawnPlan | null>(null);

    const handleGeneratePlan = () => {
        // Generate a basic lawn care plan based on user input
        const tasks = [];

        if (grassType.toLowerCase() === 'cool season') {
            tasks.push('Water deeply once a week', 'Mow at 3-4 inches', 'Fertilize in early spring');
        } else if (grassType.toLowerCase() === 'warm season') {
            tasks.push('Water twice a week', 'Mow at 1-2 inches', 'Fertilize in late spring');
        }

        if (lawnSize && parseFloat(lawnSize) > 5000) {
            tasks.push('Aerate in the fall for larger lawns');
        }

        setLawnPlan({ type: grassType, tasks });
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your LawnSensei Dashboard!</p>

            <h3>Generate Your Lawn Care Plan</h3>
            <div>
                <label>
                    Lawn Size (sq ft):
                    <input
                        type="text"
                        value={lawnSize}
                        onChange={(e) => setLawnSize(e.target.value)}
                        placeholder="Enter lawn size"
                    />
                </label>
                <br />
                <label>
                    Grass Type:
                    <select value={grassType} onChange={(e) => setGrassType(e.target.value)}>
                        <option value="">Select Grass Type</option>
                        <option value="Cool Season">Cool Season</option>
                        <option value="Warm Season">Warm Season</option>
                    </select>
                </label>
                <br />
                <button onClick={handleGeneratePlan}>Generate Plan</button>
            </div>

            {lawnPlan && (
                <div>
                    <h3>Lawn Care Plan</h3>
                    <p>Grass Type: {lawnPlan.type}</p>
                    <h4>Tasks:</h4>
                    <ul>
                        {lawnPlan.tasks.map((task, index) => (
                            <li key={index}>{task}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

