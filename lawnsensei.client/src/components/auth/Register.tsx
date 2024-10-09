// Register.tsx
import React, { useState } from 'react';
import { registerUser } from '../../services/authService';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Function to handle user registration
    const handleRegister = async () => {
        try {
            await registerUser(email, password);
            setError(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleRegister}>Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;