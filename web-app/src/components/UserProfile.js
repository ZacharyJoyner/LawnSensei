import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    grassTypePreference: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.put('http://localhost:5000/api/user-profile', userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {isEditing ? (
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
          />
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <label>Grass Type Preference: </label>
          <input
            type="text"
            name="grassTypePreference"
            value={userData.grassTypePreference}
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Grass Type Preference:</strong> {userData.grassTypePreference}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
