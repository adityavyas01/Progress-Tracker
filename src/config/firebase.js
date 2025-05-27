import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCOiX8x_adK6F0_HGl2qw0z2eutUae10Pk",
  authDomain: "goalhft.firebaseapp.com",
  projectId: "goalhft",
  storageBucket: "goalhft.firebasestorage.app",
  messagingSenderId: "958598471963",
  appId: "1:958598471963:web:19bbd875fd9ceb0d90b3be"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 