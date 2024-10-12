import React, { useState } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';

const LawnPlanForm = () => {
  const [address, setAddress] = useState('');
  const [wateringPreference, setWateringPreference] = useState('');
  const [lawnArea, setLawnArea] = useState(0);
  const [coordinates, setCoordinates] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/lawn-plans',
        { address, wateringPreference, lawnArea, coordinates },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Lawn care plan created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating lawn care plan');
    }
  };

  return (
    <div>
      <h2>Create Lawn Care Plan</h2>
      <MapComponent setLawnArea={setLawnArea} setCoordinates={setCoordinates} />
      <form onSubmit={onSubmit}>
        <div>
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label>Watering Preference:</label>
          <input type="text" value={wateringPreference} onChange={(e) => setWateringPreference(e.target.value)} />
        </div>
        <button type="submit">Create Lawn Care Plan</button>
      </form>
    </div>
  );
};

export default LawnPlanForm;
