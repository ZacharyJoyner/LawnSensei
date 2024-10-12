import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LawnDashboard = () => {
  const [lawnPlans, setLawnPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchLawnPlans = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/lawn-plans', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setLawnPlans(res.data);
      } catch (err) {
        console.error('Error fetching lawn plans:', err);
      }
    };

    fetchLawnPlans();
  }, []);

  const onEdit = (plan) => {
    setIsEditing(plan._id);
    setEditData({
      grassType: plan.grassType,
      lawnArea: plan.lawnArea,
      wateringPreference: plan.wateringPreference,
    });
  };

  const onSave = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put(
        `http://localhost:5000/api/lawn-plans/${isEditing}`,
        editData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Lawn care plan updated successfully!');
      setIsEditing(null);
      setEditData({});
    } catch (err) {
      console.error('Error updating lawn plan:', err);
    }
  };

  return (
    <div>
      <h2>Lawn Care Plan Dashboard</h2>
      {lawnPlans.length > 0 ? (
        <ul>
          {lawnPlans.map((plan) => (
            <li key={plan._id}>
              {isEditing === plan._id ? (
                <div>
                  <label>Grass Type: </label>
                  <input
                    type="text"
                    value={editData.grassType}
                    onChange={(e) => setEditData({ ...editData, grassType: e.target.value })}
                  />
                  <label>Watering Preference: </label>
                  <input
                    type="text"
                    value={editData.wateringPreference}
                    onChange={(e) => setEditData({ ...editData, wateringPreference: e.target.value })}
                  />
                  <button onClick={onSave}>Save</button>
                </div>
              ) : (
                <div>
                  <strong>Grass Type:</strong> {plan.grassType} <br />
                  <strong>Lawn Area:</strong> {plan.lawnArea} sq ft <br />
                  <strong>Watering Preference:</strong> {plan.wateringPreference} <br />
                  <button onClick={() => onEdit(plan)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No lawn care plans found.</p>
      )}
    </div>
  );
};

export default LawnDashboard;
