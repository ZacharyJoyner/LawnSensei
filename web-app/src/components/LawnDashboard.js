import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // Import jsPDF library

const LawnDashboard = () => {
  const [lawnPlans, setLawnPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);

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

    const fetchNotifications = async () => {
      const mockNotifications = [
        { id: 1, message: 'Time to water your lawn!' },
        { id: 2, message: 'New lawn care tips available.' },
      ];
      setNotifications(mockNotifications);
    };

    fetchLawnPlans();
    fetchNotifications();
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
      await axios.put(
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

  const onDelete = async (planId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:5000/api/lawn-plans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setLawnPlans(lawnPlans.filter(plan => plan._id !== planId));
      alert('Lawn care plan deleted successfully!');
    } catch (err) {
      console.error('Error deleting lawn plan:', err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lawn Care Plans', 10, 10);
    lawnPlans.forEach((plan, index) => {
      doc.text(`Plan ${index + 1}:`, 10, 20 + index * 10);
      doc.text(`Grass Type: ${plan.grassType}`, 20, 30 + index * 10);
      doc.text(`Lawn Area: ${plan.lawnArea} sq ft`, 20, 40 + index * 10);
      doc.text(`Watering Preference: ${plan.wateringPreference}`, 20, 50 + index * 10);
    });
    doc.save('lawn-care-plans.pdf');
  };

  const filteredPlans = lawnPlans.filter(plan =>
    plan.grassType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.wateringPreference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Lawn Care Plan Dashboard</h2>
      <input
        type="text"
        placeholder="Search lawn plans..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={exportToPDF}>Export to PDF</button> {/* New export button */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className="notification">
              {notification.message}
            </div>
          ))}
        </div>
      )}
      {filteredPlans.length > 0 ? (
        <ul>
          {filteredPlans.map((plan) => (
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
                  <button onClick={() => onDelete(plan._id)}>Delete</button>
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
