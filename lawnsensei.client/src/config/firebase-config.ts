// firebase-config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0Bvq6BUtGFywFwSpm8JGyRe64uDsjKck",
    authDomain: "lawn-sensei.firebaseapp.com",
    projectId: "lawn-sensei",
    storageBucket: "lawn-sensei.appspot.com",
    messagingSenderId: "951890317365",
    appId: "1:951890317365:web:aa90a133b66805fe08217c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };