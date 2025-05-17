import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {FB_KEY,FB_PROJECT_ID, FB_AUTH_DOMAIN, FB_STORAGE_BUCKET,FB_MESSAGING_SENDER_ID,FB_APP_ID,FB_MEASUREMENT_ID} from '@env';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: FB_KEY,
    authDomain: FB_AUTH_DOMAIN,
    projectId: FB_PROJECT_ID,
    storageBucket: FB_STORAGE_BUCKET,
    messagingSenderId: FB_MESSAGING_SENDER_ID,
    appId: FB_APP_ID,
    measurementId: FB_MEASUREMENT_ID
    
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 