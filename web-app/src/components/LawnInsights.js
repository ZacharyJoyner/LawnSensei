import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './LawnInsights.css';

const LawnInsights = () => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/lawn-insights', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setInsights(res.data);
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    };

    fetchInsights();
  }, []);

  const data = {
    labels: insights.map(insight => insight.date),
    datasets: [
      {
        label: 'Water Usage (liters)',
        data: insights.map(insight => insight.waterUsage),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="lawn-insights">
      <h2>Lawn Care Insights</h2>
      <Bar data={data} />
    </div>
  );
};

export default LawnInsights;
