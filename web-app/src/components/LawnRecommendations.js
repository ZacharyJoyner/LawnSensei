import React from 'react';

const LawnRecommendations = ({ formData }) => {
  if (!formData) {
    return <div>Please provide lawn details to get recommendations.</div>;
  }

  const { grassType, lawnUsage, wateringPreference, region } = formData;

  // Example recommendations based on user input
  const recommendations = [];

  if (grassType === 'cool-season') {
    recommendations.push('Apply fertilizer with high nitrogen content in early spring.');
  } else if (grassType === 'warm-season') {
    recommendations.push('Use a slow-release fertilizer in late spring.');
  }

  if (wateringPreference === 'low') {
    recommendations.push('Water deeply but infrequently, aiming for 1 inch of water per week.');
  } else if (wateringPreference === 'high') {
    recommendations.push('Water more frequently to maintain lush growth, especially in hot weather.');
  }

  if (lawnUsage === 'high-traffic') {
    recommendations.push('Consider overseeding with a durable grass variety to keep up with wear and tear.');
  }

  return (
    <div>
      <h2>Lawn Care Recommendations</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default LawnRecommendations;