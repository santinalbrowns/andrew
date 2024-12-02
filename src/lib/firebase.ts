import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD-_KrhnhFY2juqHHoL-Yn1yyKLTgFofHk",
    authDomain: "tikets-2bc6c.firebaseapp.com",
    projectId: "tikets-2bc6c",
    storageBucket: "tikets-2bc6c.firebasestorage.app",
    messagingSenderId: "1077127188762",
    appId: "1:1077127188762:web:f366226d6f4bbe8c4a9ca3",
    measurementId: "G-4CP5DF028Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);