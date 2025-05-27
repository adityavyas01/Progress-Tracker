import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
  // Create a new notification
  async createNotification(userId, notification) {
    try {
      const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
      const docRef = await addDoc(notificationsRef, {
        userId,
        ...notification,
        read: false,
        createdAt: Timestamp.now(),
        readAt: null
      });
      return { id: docRef.id, ...notification };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get user's notifications
  async getNotifications(userId, limitCount = 20) {
    try {
      const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
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
        readAt: Timestamp.now()
      });
      return { success: true };
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
      return { success: true };
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