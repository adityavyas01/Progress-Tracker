import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const BOOKMARKS_COLLECTION = 'bookmarks';

export const bookmarkService = {
  // Add a new bookmark
  async addBookmark(userId, bookmark) {
    try {
      const bookmarkData = {
        userId,
        ...bookmark,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, BOOKMARKS_COLLECTION), bookmarkData);
      return { id: docRef.id, ...bookmarkData };
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  // Get user's bookmarks
  async getUserBookmarks(userId) {
    try {
      const q = query(
        collection(db, BOOKMARKS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      throw error;
    }
  },

  // Update bookmark
  async updateBookmark(bookmarkId, updates) {
    try {
      const bookmarkRef = doc(db, BOOKMARKS_COLLECTION, bookmarkId);
      await updateDoc(bookmarkRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return bookmarkId;
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  },

  // Delete bookmark
  async deleteBookmark(bookmarkId) {
    try {
      const bookmarkRef = doc(db, BOOKMARKS_COLLECTION, bookmarkId);
      await deleteDoc(bookmarkRef);
      return bookmarkId;
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  },

  // Get bookmarks by category
  async getBookmarksByCategory(userId, category) {
    try {
      const q = query(
        collection(db, BOOKMARKS_COLLECTION),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting bookmarks by category:', error);
      throw error;
    }
  },

  // Get bookmark categories
  async getBookmarkCategories() {
    return [
      { id: 'articles', name: 'Articles', icon: 'file-text' },
      { id: 'videos', name: 'Videos', icon: 'video' },
      { id: 'courses', name: 'Courses', icon: 'book' },
      { id: 'tools', name: 'Tools', icon: 'tool' },
      { id: 'practice', name: 'Practice Problems', icon: 'code' },
      { id: 'other', name: 'Other', icon: 'folder' }
    ];
  },

  // Search bookmarks
  async searchBookmarks(userId, searchTerm) {
    try {
      const bookmarks = await this.getUserBookmarks(userId);
      const searchTermLower = searchTerm.toLowerCase();
      
      return bookmarks.filter(bookmark => 
        bookmark.title.toLowerCase().includes(searchTermLower) ||
        bookmark.description.toLowerCase().includes(searchTermLower) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      throw error;
    }
  }
}; 