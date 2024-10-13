import React, { useState } from 'react';
import axios from 'axios';

const WeedIdentifier = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <div className="weed-identifier">
      <h2>Identify Weeds</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Identify Weed</button>
      {result && (
        <div className="result">
          <h3>Weed Identified: {result.name}</h3>
          <p>{result.description}</p>
          <a href={result.affiliateLink} target="_blank" rel="noopener noreferrer">
            Buy Recommended Herbicide
          </a>
        </div>
      )}
    </div>
  );
};

export default WeedIdentifier;
