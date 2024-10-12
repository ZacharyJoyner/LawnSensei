import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(res.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" value={name} onChange={onChange} required placeholder="Name" />
      <input type="email" name="email" value={email} onChange={onChange} required placeholder="Email" />
      <input type="password" name="password" value={password} onChange={onChange} required placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
