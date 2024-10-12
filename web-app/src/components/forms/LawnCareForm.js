import React, { useState } from 'react';

const LawnCareForm = ({ onSubmit }) => {
  const [grassType, setGrassType] = useState('');
  const [lawnUsage, setLawnUsage] = useState('');
  const [wateringPreference, setWateringPreference] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      grassType,
      lawnUsage,
      wateringPreference,
    };
    onSubmit(formData); // Pass data back to the parent component
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
      <div>
        <label>
          Grass Type (if known):
          <select value={grassType} onChange={(e) => setGrassType(e.target.value)}>
            <option value="">Select</option>
            <option value="Cool Season Grass">Cool Season Grass</option>
            <option value="Warm Season Grass">Warm Season Grass</option>
            <option value="Unknown">I don't know</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Lawn Usage:
          <select value={lawnUsage} onChange={(e) => setLawnUsage(e.target.value)}>
            <option value="">Select</option>
            <option value="Children's Play Area">Children's Play Area</option>
            <option value="Pets Area">Pets Area</option>
            <option value="Aesthetic Only">Aesthetic Only</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Watering Preference:
          <select value={wateringPreference} onChange={(e) => setWateringPreference(e.target.value)}>
            <option value="">Select</option>
            <option value="Low Maintenance">Low Maintenance</option>
            <option value="Moderate">Moderate</option>
            <option value="High Maintenance">High Maintenance</option>
          </select>
        </label>
      </div>
      <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
    </form>
  );
};

export default LawnCareForm;
