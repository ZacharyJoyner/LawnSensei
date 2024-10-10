import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';

interface LawnCarePlan {
    task: string;
    description: string;
    dueDate: string;
}

const Dashboard: React.FC = () => {
    const [lawnCarePlan, setLawnCarePlan] = useState<LawnCarePlan[]>([]);

    useEffect(() => {
        const fetchLawnCarePlan = async () => {
            try {
                const response = await axios.get('/api/LawnCarePlan');
                setLawnCarePlan(response.data);
            } catch (error) {
                console.error('Error fetching lawn care plan:', error);
                alert('There was an error fetching your lawn care plan. Please try again.');
            }
        };

        fetchLawnCarePlan();
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Lawn Care Dashboard
            </Typography>
            {lawnCarePlan.length > 0 ? (
                <Grid container spacing={2}>
                    {lawnCarePlan.map((plan, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {plan.task}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {plan.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Due Date:</strong> {plan.dueDate}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No lawn care tasks available at the moment. Please complete onboarding to receive your customized lawn care plan.</Typography>
            )}
        </Container>
    );
};

export default Dashboard;