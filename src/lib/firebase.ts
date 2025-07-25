// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmcC-ahcx4VB3z0Jgkz7Se-QsrJGaJjcI",
  authDomain: "collabtask-58111.firebaseapp.com",
  projectId: "collabtask-58111",
  storageBucket: "collabtask-58111.firebasestorage.app",
  messagingSenderId: "516505999289",
  appId: "1:516505999289:web:7cfa3c32caf0bfedd38868"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
