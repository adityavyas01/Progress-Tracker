import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';

const userService = {
  // Create or update user profile
  async createOrUpdateUser(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          preferences: {
            darkMode: false,
            notifications: true,
            emailNotifications: true,
            studyReminders: true
          },
          stats: {
            totalTasksCompleted: 0,
            totalStudyHours: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: null,
            achievements: []
          }
        });
      } else {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'preferences': preferences,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  // Update user stats
  async updateUserStats(userId, stats) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'stats': stats,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },

  // Add achievement
  async addAchievement(userId, achievement) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'stats.achievements': arrayUnion(achievement),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  },

  // Remove achievement
  async removeAchievement(userId, achievement) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'stats.achievements': arrayRemove(achievement),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error removing achievement:', error);
      throw error;
    }
  },

  // Search users
  async searchUsers(searchTerm) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Export user data
  async exportUserData(userId) {
    try {
      const userData = await this.getUserProfile(userId);
      
      // Get user's tasks
      const tasksRef = collection(db, 'tasks');
      const tasksQuery = query(tasksRef, where('userId', '==', userId));
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      // Get user's bookmarks
      const bookmarksRef = collection(db, 'bookmarks');
      const bookmarksQuery = query(bookmarksRef, where('userId', '==', userId));
      const bookmarksSnapshot = await getDocs(bookmarksQuery);
      const bookmarks = [];
      bookmarksSnapshot.forEach((doc) => {
        bookmarks.push({ id: doc.id, ...doc.data() });
      });
      
      // Get user's notifications
      const notificationsRef = collection(db, 'notifications');
      const notificationsQuery = query(notificationsRef, where('userId', '==', userId));
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notifications = [];
      notificationsSnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      
      return {
        user: userData,
        tasks,
        bookmarks,
        notifications
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  },

  // Import user data
  async importUserData(userId, data) {
    try {
      // Update user profile
      await this.createOrUpdateUser(userId, data.user);
      
      // Import tasks
      for (const task of data.tasks) {
        const taskRef = doc(db, 'tasks', task.id);
        await setDoc(taskRef, {
          ...task,
          userId,
          updatedAt: serverTimestamp()
        });
      }
      
      // Import bookmarks
      for (const bookmark of data.bookmarks) {
        const bookmarkRef = doc(db, 'bookmarks', bookmark.id);
        await setDoc(bookmarkRef, {
          ...bookmark,
          userId,
          updatedAt: serverTimestamp()
        });
      }
      
      // Import notifications
      for (const notification of data.notifications) {
        const notificationRef = doc(db, 'notifications', notification.id);
        await setDoc(notificationRef, {
          ...notification,
          userId,
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  }
};

export default userService; 