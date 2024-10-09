import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const registerUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered:", userCredential.user);
            alert("User registered successfully!");
            setError(null);
        } catch (error: any) {
            console.error("Error registering user:", error.message);
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
            <button onClick={registerUser}>Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;
