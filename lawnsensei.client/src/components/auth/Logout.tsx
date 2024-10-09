import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";

const Logout: React.FC = () => {
    const logoutUser = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
            sessionStorage.removeItem("authToken"); // Use sessionStorage instead of localStorage
            alert("Logout successful!");
        } catch (error: any) {
            console.error("Error signing out:", error.message);
        }
    };

    return <button onClick={logoutUser}>Logout</button>;
};

export default Logout;
