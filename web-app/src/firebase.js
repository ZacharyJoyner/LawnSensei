import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB0Bvq6BUtGFywFwSpm8JGyRe64uDsjKck",
    authDomain: "lawn-sensei.firebaseapp.com",
    projectId: "lawn-sensei",
    storageBucket: "lawn-sensei.appspot.com",
    messagingSenderId: "951890317365",
    appId: "1:951890317365:web:aa90a133b66805fe08217c",
    measurementId: "G-VNFCWXQ2JB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
