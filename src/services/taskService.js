import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';

const CUSTOM_TASKS_COLLECTION = 'customTasks';

export const taskService = {
  // Create a new custom task
  async createTask(task) {
    try {
      const docRef = await addDoc(collection(db, CUSTOM_TASKS_COLLECTION), {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update an existing custom task
  async updateTask(taskId, updates) {
    try {
      const taskRef = doc(db, CUSTOM_TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { id: taskId, ...updates };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a custom task
  async deleteTask(taskId) {
    try {
      const taskRef = doc(db, CUSTOM_TASKS_COLLECTION, taskId);
      await deleteDoc(taskRef);
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get custom tasks for a specific phase/week/day
  async getCustomTasks(phaseId, weekId, dayId) {
    try {
      const q = query(
        collection(db, CUSTOM_TASKS_COLLECTION),
        where('phaseId', '==', phaseId),
        where('weekId', '==', weekId),
        where('dayId', '==', dayId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting custom tasks:', error);
      throw error;
    }
  },

  // Get all custom tasks for a user
  async getAllCustomTasks() {
    try {
      const querySnapshot = await getDocs(collection(db, CUSTOM_TASKS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all custom tasks:', error);
      throw error;
    }
  }
}; 