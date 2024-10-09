import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const loginUser = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredential.user);
            alert("Login successful!");
            setError(null);
        } catch (error: any) {
            console.error("Error logging in user:", error.message);
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            <button onClick={loginUser}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
