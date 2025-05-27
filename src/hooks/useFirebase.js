import { useState, useEffect } from 'react';
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
import { getAuth } from 'firebase/auth';

export const useFirebase = (userId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Reset states when userId changes
    setError(null);
    setLoading(true);
  }, [userId]);

  // Save user progress
  const saveProgress = async (data) => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated to save progress'));
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      setError(err);
      console.error('Error saving progress:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user progress
  const getProgress = async () => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated to get progress'));
      return null;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Update specific fields
  const updateProgress = async (fields) => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated to update progress'));
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...fields,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError(err);
      console.error('Error updating progress:', err);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  const subscribeToProgress = (callback) => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated to subscribe to progress'));
      return () => {};
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      const unsubscribe = onSnapshot(userRef, 
        (doc) => {
          if (doc.exists()) {
            callback(doc.data());
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          console.error('Error in progress subscription:', err);
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch (err) {
      setError(err);
      console.error('Error subscribing to progress:', err);
      setLoading(false);
      return () => {};
    }
  };

  // Get study group members
  const getStudyGroupMembers = async (groupId) => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated to get study group members'));
      return [];
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Save study group message
  const saveMessage = async (groupId, message) => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated to save messages'));
      return;
    }

    try {
      setLoading(true);
      const messagesRef = collection(db, 'studyGroups', groupId, 'messages');
      await addDoc(messagesRef, {
        ...message,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err);
      console.error('Error saving message:', err);
    } finally {
      setLoading(false);
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