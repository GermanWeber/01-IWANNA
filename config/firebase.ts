import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDDSLh1lECWiyBqDRbHvHzkhBxXwwZup1s",
    authDomain: "iwanna-c8a1d.firebaseapp.com",
    projectId: "iwanna-c8a1d",
    storageBucket: "iwanna-c8a1d.firebasestorage.app",
    messagingSenderId: "697310693712",
    appId: "1:697310693712:web:aa996b310166ab0d07c455"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 