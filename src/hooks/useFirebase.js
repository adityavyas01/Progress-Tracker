import { useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useFirebase = (userId) => {
  const [loading] = useState(true);
  const [error, setError] = useState(null);

  // Save user progress
  const saveProgress = async (data) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      setError(err);
      console.error('Error saving progress:', err);
    }
  };

  // Get user progress
  const getProgress = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (err) {
      setError(err);
      console.error('Error getting progress:', err);
      return null;
    }
  };

  // Update specific fields
  const updateProgress = async (fields) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...fields,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError(err);
      console.error('Error updating progress:', err);
    }
  };

  // Subscribe to real-time updates
  const subscribeToProgress = (callback) => {
    try {
      const userRef = doc(db, 'users', userId);
      return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          callback(doc.data());
        }
      });
    } catch (err) {
      setError(err);
      console.error('Error subscribing to progress:', err);
    }
  };

  // Get study group members
  const getStudyGroupMembers = async (groupId) => {
    try {
      const membersRef = collection(db, 'studyGroups', groupId, 'members');
      const q = query(membersRef, where('active', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      setError(err);
      console.error('Error getting study group members:', err);
      return [];
    }
  };

  // Save study group message
  const saveMessage = async (groupId, message) => {
    try {
      const messagesRef = collection(db, 'studyGroups', groupId, 'messages');
      await addDoc(messagesRef, {
        ...message,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err);
      console.error('Error saving message:', err);
    }
  };

  return {
    loading,
    error,
    saveProgress,
    getProgress,
    updateProgress,
    subscribeToProgress,
    getStudyGroupMembers,
    saveMessage
  };
}; 