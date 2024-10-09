import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "YAIzaSyB0Bvq6BUtGFywFwSpm8JGyRe64uDsjKck",
    authDomain: "lawn- sensei.firebaseapp.com",
    projectId: "lawn-sensei",
    storageBucket: "lawn- sensei.appspot.com",
    messagingSenderId: "951890317365",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
