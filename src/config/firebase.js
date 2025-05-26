import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCOiX8x_adK6F0_HGl2qw0z2eutUae10Pk",
    authDomain: "goalhft.firebaseapp.com",
    projectId: "goalhft",
    storageBucket: "goalhft.firebasestorage.app",
    messagingSenderId: "958598471963",
    appId: "1:958598471963:web:19bbd875fd9ceb0d90b3be",
    measurementId: "G-70EFVJLH1H"
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