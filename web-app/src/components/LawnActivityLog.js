import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LawnActivityLog.css';

const LawnActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/lawn-activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setActivities(res.data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="lawn-activity-log">
      <h2>Lawn Care Activity Log</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <strong>{activity.date}:</strong> {activity.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LawnActivityLog;
