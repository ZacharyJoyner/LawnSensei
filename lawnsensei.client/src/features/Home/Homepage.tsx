import React from 'react';
import './Homepage.scss'; // Import SCSS file

function Homepage() {
    return (
        <div className="homepage">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                        <img src="logo.png" alt="Lawn Sensei Logo" />
                        <span>Lawn Sensei</span>
                    </div>
                    {/* Hamburger Menu Icon (for mobile) */}
                    <div className="hamburger-menu">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                    {/* Navigation Links (desktop) */}
                    <ul className="nav-links">
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </nav>

            {/* Rotating Marketing Banner */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Your Lawn, Your Zen</h1>
                    <p>Discover the Art of Lawn Care with Lawn Sensei</p>
                    <button className="cta-button">Get Started</button>
                </div>
            </div>

            {/* Main Content Sections */}
            <section id="services" className="services">
                {/* Add your services content here */}
            </section>

            <section id="about" className="about">
                {/* Add information about your company or brand */}
            </section>

            <section id="contact" className="contact">
                {/* Add a contact form or contact details */}
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2023 Lawn Sensei. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Homepage;
