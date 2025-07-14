// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAujno-utT-ESWCIzTwB4uUJhHBYHKKNls",
  authDomain: "dine-time-bdf74.firebaseapp.com",
  projectId: "dine-time-bdf74",
  storageBucket: "dine-time-bdf74.firebasestorage.app",
  messagingSenderId: "694384550930",
  appId: "1:694384550930:web:7df267bffc3bd0d796a4cb",
  measurementId: "G-QX0Z7PNLWJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);