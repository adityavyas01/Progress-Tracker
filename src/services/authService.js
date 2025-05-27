import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const auth = getAuth();

export const authService = {
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      if (!result.user) {
        throw new Error('No user data received from Google sign-in');
      }
      
      await this.createOrUpdateUser(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else {
        throw new Error('Failed to sign in with Google. Please try again.');
      }
    }
  },

  // Sign in with GitHub
  async signInWithGithub() {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!result.user) {
        throw new Error('No user data received from GitHub sign-in');
      }
      
      await this.createOrUpdateUser(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else {
        throw new Error('Failed to sign in with GitHub. Please try again.');
      }
    }
  },

  // Sign out
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Create or update user document in Firestore
  async createOrUpdateUser(user) {
    if (!user || !user.uid) {
      throw new Error('Invalid user data');
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: 'light',
            notifications: true
          }
        });
      } else {
        // Update existing user document
        await setDoc(userRef, {
          lastLogin: new Date().toISOString(),
          displayName: user.displayName || userDoc.data().displayName,
          photoURL: user.photoURL || userDoc.data().photoURL
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw new Error('Failed to create/update user profile. Please try again.');
    }
  },

  // Get user preferences
  async getUserPreferences(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data().preferences;
      }
      return null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('Failed to get user preferences. Please try again.');
    }
  },

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { preferences }, { merge: true });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences. Please try again.');
    }
  },

  // Sign in with email and password
  async signInWithEmail(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user) {
        throw new Error('No user data received from email sign-in');
      }
      
      await this.createOrUpdateUser(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with email:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check and try again.');
      } else {
        throw new Error('Failed to sign in. Please try again.');
      }
    }
  },

  // Sign up with email and password
  async signUpWithEmail(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (!result.user) {
        throw new Error('No user data received from email sign-up');
      }
      
      await this.createOrUpdateUser(result.user);
      return result;
    } catch (error) {
      console.error('Error signing up with email:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account already exists with this email. Please sign in instead.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check and try again.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
    }
  }
}; 