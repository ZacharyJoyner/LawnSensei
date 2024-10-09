// authService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";

// Centralized error handler
const handleAuthError = (error: any) => {
    console.error("Authentication Error:", error.message);
    throw new Error(error.message);
};

// Utility functions to manage tokens
const setAuthToken = (token: string) => {
    sessionStorage.setItem("authToken", token);
};

const getAuthToken = (): string | null => {
    return sessionStorage.getItem("authToken");
};

// Function to handle user registration
export const registerUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        alert("Registration successful!");

        // Get the JWT token
        const token = await userCredential.user.getIdToken();
        console.log("JWT Token:", token);

        // Save the token for later use
        setAuthToken(token);
        return userCredential.user;
    } catch (error: any) {
        handleAuthError(error);
    }
};

// Function to handle user login
export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        alert("Login successful!");

        // Get the JWT token
        const token = await userCredential.user.getIdToken();
        console.log("JWT Token:", token);

        // Save the token for later use
        setAuthToken(token);
        return userCredential.user;
    } catch (error: any) {
        handleAuthError(error);
    }
};

export { getAuthToken };