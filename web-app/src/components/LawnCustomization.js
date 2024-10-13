import React, { useState } from 'react';
import './LawnCustomization.css';

const LawnCustomization = ({ onCustomize }) => {
  const [goals, setGoals] = useState({
    greenerGrass: false,
    pestControl: false,
    droughtResistance: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setGoals({ ...goals, [name]: checked });
  };

  const handleSubmit = () => {
    onCustomize(goals);
  };

  return (
    <div className="lawn-customization">
      <h2>Customize Your Lawn Care Plan</h2>
      <div className="options">
        <label>
          <input
            type="checkbox"
            name="greenerGrass"
            checked={goals.greenerGrass}
            onChange={handleChange}
          />
          Greener Grass
        </label>
        <label>
          <input
            type="checkbox"
            name="pestControl"
            checked={goals.pestControl}
            onChange={handleChange}
          />
          Pest Control
        </label>
        <label>
          <input
            type="checkbox"
            name="droughtResistance"
            checked={goals.droughtResistance}
            onChange={handleChange}
          />
          Drought Resistance
        </label>
      </div>
      <button onClick={handleSubmit}>Apply Customization</button>
    </div>
  );
};

export default LawnCustomization;
