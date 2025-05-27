import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let db;
let auth;
let storage;

try {
  // Check if Firebase is already initialized
  if (!app) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  }

  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  // Verify initialization
  if (!db || !auth || !storage) {
    throw new Error('Failed to initialize Firebase services');
  }

  console.log('All Firebase services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // You might want to show a user-friendly error message here
  throw error;
}

export { app, db, auth, storage }; 