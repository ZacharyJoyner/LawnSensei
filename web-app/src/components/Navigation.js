import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';  // Make sure this line is present

function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Lawn Sensei</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/lawn-plan">Lawn Plan</Link>
        <Link to="/area-calculator">Area Calculator</Link>
        <Link to="/recommendations">Recommendations</Link>
      </div>
    </nav>
  );
}

export default Navigation;
