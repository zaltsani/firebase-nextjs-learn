// Import necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSUxZvQYlkXUdAH9JUkXof-w-aSO3RBk4",
  authDomain: "nextjs-firebase-learn.firebaseapp.com",
  databaseURL: "https://nextjs-firebase-learn-default-rtdb.firebaseio.com",
  projectId: "nextjs-firebase-learn",
  storageBucket: "nextjs-firebase-learn.appspot.com",
  messagingSenderId: "349410462902",
  appId: "1:349410462902:web:f0b7db79437edb70f8ea17",
  measurementId: "G-J6B0RSY5QG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and export it
export const database = getDatabase(app);
export const firestoredb = getFirestore(app);