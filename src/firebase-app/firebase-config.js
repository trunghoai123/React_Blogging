 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyA6LJSekoy9HtQz2LUTCD7vbaQZIXMFOVY",
  authDomain: "monkey-blogging-1c1d6.firebaseapp.com",
  projectId: "monkey-blogging-1c1d6",
  storageBucket: "monkey-blogging-1c1d6.appspot.com",
  messagingSenderId: "301544204498",
  appId: "1:301544204498:web:f8a48ce1bd98b22b3c650b",
  measurementId: "G-YC2QKMJSZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);