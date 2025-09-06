import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query as firestoreQuery, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
// @ts-ignore
import { auth, db } from '../firebase/config';

export interface UserActivity {
  userId: string;
  totalSearches: number;
  totalProvidersFound: number;
  thisMonthSearches: number;
  lastSearchDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  searchHistory: SearchRecord[];
}

export interface SearchRecord {
  id: string;
  query: string;
  providersFound: number;
  timestamp: Date;
  category?: string;
}

export interface ActivityStats {
  totalSearches: number;
  totalProvidersFound: number;
  thisMonthSearches: number;
  searchesChange: string;
  providersChange: string;
  monthlyChange: string;
}

export const UserActivityService = {
  // Initialize user activity document
  initializeUserActivity: async (userId: string): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // @ts-ignore
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated');
      }

      // @ts-ignore
      const activityRef = doc(db, 'userActivity', userId);
      const activityDoc = await getDoc(activityRef);

      if (!activityDoc.exists()) {
        const initialActivity: Omit<UserActivity, 'searchHistory'> = {
          userId,
          totalSearches: 0,
          totalProvidersFound: 0,
          thisMonthSearches: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(activityRef, {
          ...initialActivity,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          searchHistory: []
        });

        console.log('[ACTIVITY] User activity initialized for:', userId);
      }
    } catch (error) {
      console.error('Error initializing user activity:', error);
      throw error;
    }
  },

  // Record a new search
  recordSearch: async (userId: string, query: string, providersFound: number, category?: string): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // @ts-ignore
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated');
      }

      // Ensure user activity document exists
      await UserActivityService.initializeUserActivity(userId);

      // @ts-ignore
      const activityRef = doc(db, 'userActivity', userId);
      // @ts-ignore
      const searchRecordRef = doc(collection(db, 'searchHistory'));

      // Create search record
      const searchRecord = {
        userId,
        query,
        providersFound,
        category: category || 'general',
        timestamp: serverTimestamp()
      };

      // Save search record
      await setDoc(searchRecordRef, searchRecord);

      // Update user activity stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Get current activity to check if we need to reset monthly stats
      const activityDoc = await getDoc(activityRef);
      let shouldResetMonthly = false;

      if (activityDoc.exists()) {
        const data = activityDoc.data();
        const lastUpdate = data.updatedAt?.toDate() || new Date();
        const lastMonth = lastUpdate.getMonth();
        const lastYear = lastUpdate.getFullYear();

        // Reset monthly stats if it's a new month
        shouldResetMonthly = (currentMonth !== lastMonth) || (currentYear !== lastYear);
      }

      // Update activity document
      await updateDoc(activityRef, {
        totalSearches: increment(1),
        totalProvidersFound: increment(providersFound),
        thisMonthSearches: shouldResetMonthly ? 1 : increment(1),
        lastSearchDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('[ACTIVITY] Search recorded:', { query, providersFound, category });
    } catch (error) {
      console.error('Error recording search:', error);
      throw error;
    }
  },

  // Get user activity stats
  getUserActivity: async (userId: string): Promise<UserActivity | null> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // @ts-ignore
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated');
      }

      // Ensure user activity document exists
      await UserActivityService.initializeUserActivity(userId);

      // @ts-ignore
      const activityRef = doc(db, 'userActivity', userId);
      const activityDoc = await getDoc(activityRef);

      if (!activityDoc.exists()) {
        return null;
      }

      const data = activityDoc.data();

      // Get recent search history
      const searchHistoryQuery = firestoreQuery(
        // @ts-ignore
        collection(db, 'searchHistory'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const searchHistorySnapshot = await getDocs(searchHistoryQuery);
      const searchHistory: SearchRecord[] = searchHistorySnapshot.docs.map(doc => {
        const searchData = doc.data();
        return {
          id: doc.id,
          query: searchData.query,
          providersFound: searchData.providersFound,
          timestamp: searchData.timestamp?.toDate() || new Date(),
          category: searchData.category
        };
      });

      return {
        userId: data.userId,
        totalSearches: data.totalSearches || 0,
        totalProvidersFound: data.totalProvidersFound || 0,
        thisMonthSearches: data.thisMonthSearches || 0,
        lastSearchDate: data.lastSearchDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        searchHistory
      };
    } catch (error) {
      console.error('Error getting user activity:', error);
      throw error;
    }
  },

  // Get activity stats with percentage changes
  getActivityStats: async (userId: string): Promise<ActivityStats> => {
    try {
      const activity = await UserActivityService.getUserActivity(userId);
      
      if (!activity) {
        return {
          totalSearches: 0,
          totalProvidersFound: 0,
          thisMonthSearches: 0,
          searchesChange: '+0%',
          providersChange: '+0%',
          monthlyChange: '+0%'
        };
      }

      // Calculate percentage changes (simplified calculation)
      // In a real app, you'd compare with previous periods
      const searchesChange = activity.totalSearches > 0 ? 
        `+${Math.min(Math.floor((activity.totalSearches / 10) * 100), 100)}%` : '+0%';
      
      const providersChange = activity.totalProvidersFound > 0 ? 
        `+${Math.min(Math.floor((activity.totalProvidersFound / 100) * 100), 100)}%` : '+0%';
      
      const monthlyChange = activity.thisMonthSearches > 0 ? 
        `+${Math.min(Math.floor((activity.thisMonthSearches / 5) * 100), 100)}%` : '+0%';

      return {
        totalSearches: activity.totalSearches,
        totalProvidersFound: activity.totalProvidersFound,
        thisMonthSearches: activity.thisMonthSearches,
        searchesChange,
        providersChange,
        monthlyChange
      };
    } catch (error) {
      console.error('Error getting activity stats:', error);
      // Return default stats on error
      return {
        totalSearches: 0,
        totalProvidersFound: 0,
        thisMonthSearches: 0,
        searchesChange: '+0%',
        providersChange: '+0%',
        monthlyChange: '+0%'
      };
    }
  },

  // Get search history for a user
  getSearchHistory: async (userId: string, limitCount: number = 20): Promise<SearchRecord[]> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // @ts-ignore
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated');
      }

      const searchHistoryQuery = firestoreQuery(
        // @ts-ignore
        collection(db, 'searchHistory'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(searchHistoryQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          query: data.query,
          providersFound: data.providersFound,
          timestamp: data.timestamp?.toDate() || new Date(),
          category: data.category
        };
      });
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  }
};
