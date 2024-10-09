import React from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage: React.FC = () => {
    return (
        <div>
            <h2>Authentication</h2>
            <Login />
            <Register />
        </div>
    );
};

export default AuthPage;
