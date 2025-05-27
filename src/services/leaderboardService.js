import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

const LEADERBOARD_COLLECTION = 'leaderboard';

export const leaderboardService = {
  // Update user's leaderboard score
  async updateScore(userId, userData) {
    try {
      const score = this.calculateScore(userData);
      const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, userId);
      const leaderboardDoc = await getDoc(leaderboardRef);
      
      const leaderboardData = {
        userId,
        name: userData.name,
        score,
        completedTasks: userData.completedTasks.size,
        totalHours: userData.totalHours,
        streak: userData.currentStreak,
        achievements: userData.achievements.size,
        updatedAt: new Date().toISOString()
      };

      if (!leaderboardDoc.exists()) {
        // Create new document if it doesn't exist
        await setDoc(leaderboardRef, leaderboardData);
      } else {
        // Update existing document
        await updateDoc(leaderboardRef, leaderboardData);
      }
      
      return { userId, score };
    } catch (error) {
      console.error('Error updating leaderboard score:', error);
      throw error;
    }
  },

  // Get top users
  async getTopUsers(limit = 10) {
    try {
      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        orderBy('score', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting top users:', error);
      throw error;
    }
  },

  // Get user's rank
  async getUserRank(userId) {
    try {
      const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
      const q = query(leaderboardRef, orderBy('score', 'desc'));
      const snapshot = await getDocs(q);
      const userIndex = snapshot.docs.findIndex(doc => doc.id === userId);
      return userIndex + 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  },

  // Calculate user's score based on various factors
  calculateScore(userData) {
    const taskScore = userData.completedTasks.size * 10;
    const hourScore = userData.totalHours * 5;
    const streakScore = userData.currentStreak * 2;
    const achievementScore = userData.achievements.size * 20;
    
    return taskScore + hourScore + streakScore + achievementScore;
  },

  // Get leaderboard categories
  async getLeaderboardCategories() {
    return [
      { id: 'overall', name: 'Overall' },
      { id: 'tasks', name: 'Tasks Completed' },
      { id: 'hours', name: 'Hours Spent' },
      { id: 'streak', name: 'Current Streak' },
      { id: 'achievements', name: 'Achievements' }
    ];
  },

  // Get category-specific leaderboard
  async getCategoryLeaderboard(category) {
    try {
      const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
      const q = query(
        leaderboardRef,
        orderBy(category === 'overall' ? 'score' : category, 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}; 