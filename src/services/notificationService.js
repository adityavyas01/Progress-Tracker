import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
  // Create a new notification
  async createNotification(userId, notification) {
    try {
      const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        userId,
        ...notification,
        createdAt: new Date().toISOString(),
        read: false
      });
      return { id: docRef.id, ...notification };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get user's notifications
  async getNotifications(userId, limit = 20) {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date().toISOString()
      });
      return notificationId;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await deleteDoc(notificationRef);
      return notificationId;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Create different types of notifications
  async createTaskCompletionNotification(userId, task) {
    return this.createNotification(userId, {
      type: 'task_completion',
      title: 'Task Completed! 🎉',
      message: `You've completed "${task.title}"`,
      icon: 'check-circle',
      priority: 'medium'
    });
  },

  async createStreakNotification(userId, streak) {
    return this.createNotification(userId, {
      type: 'streak',
      title: '🔥 Streak Update',
      message: `You're on a ${streak}-day streak! Keep it up!`,
      icon: 'flame',
      priority: 'high'
    });
  },

  async createAchievementNotification(userId, achievement) {
    return this.createNotification(userId, {
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: achievement,
      icon: 'trophy',
      priority: 'high'
    });
  },

  async createDailyReminderNotification(userId) {
    return this.createNotification(userId, {
      type: 'reminder',
      title: '📚 Daily Study Reminder',
      message: 'Time to continue your quant journey!',
      icon: 'bell',
      priority: 'medium'
    });
  },

  async createMilestoneNotification(userId, milestone) {
    return this.createNotification(userId, {
      type: 'milestone',
      title: '🎯 Milestone Reached!',
      message: milestone,
      icon: 'target',
      priority: 'high'
    });
  }
}; 