import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, updateDoc, doc } from 'firebase/firestore';

const LEADERBOARD_COLLECTION = 'leaderboard';

export const leaderboardService = {
  // Update user's leaderboard score
  async updateScore(userId, userData) {
    try {
      const score = this.calculateScore(userData);
      const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, userId);
      
      await updateDoc(leaderboardRef, {
        userId,
        name: userData.name,
        score,
        completedTasks: userData.completedTasks,
        totalHours: userData.totalHours,
        streak: userData.currentStreak,
        achievements: userData.achievements,
        updatedAt: new Date().toISOString()
      });
      
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
      const userDoc = await getDocs(doc(db, LEADERBOARD_COLLECTION, userId));
      if (!userDoc.exists()) return null;

      const userScore = userDoc.data().score;
      
      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        where('score', '>', userScore)
      );
      
      const higherScores = await getDocs(q);
      return higherScores.size + 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  },

  // Calculate user's score based on various factors
  calculateScore(userData) {
    const taskScore = userData.completedTasks.size * 10;
    const hourScore = userData.totalHours * 5;
    const streakScore = userData.currentStreak * 15;
    const achievementScore = userData.achievements.size * 25;
    
    return taskScore + hourScore + streakScore + achievementScore;
  },

  // Get leaderboard categories
  async getLeaderboardCategories() {
    return [
      { id: 'overall', name: 'Overall', icon: 'trophy' },
      { id: 'tasks', name: 'Tasks Completed', icon: 'check-circle' },
      { id: 'hours', name: 'Hours Studied', icon: 'clock' },
      { id: 'streak', name: 'Current Streak', icon: 'flame' },
      { id: 'achievements', name: 'Achievements', icon: 'star' }
    ];
  },

  // Get category-specific leaderboard
  async getCategoryLeaderboard(category, limit = 10) {
    try {
      let orderField;
      switch (category) {
        case 'tasks':
          orderField = 'completedTasks';
          break;
        case 'hours':
          orderField = 'totalHours';
          break;
        case 'streak':
          orderField = 'streak';
          break;
        case 'achievements':
          orderField = 'achievements';
          break;
        default:
          orderField = 'score';
      }

      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        orderBy(orderField, 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting category leaderboard:', error);
      throw error;
    }
  }
}; 