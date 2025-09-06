import { 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup, 
  onAuthStateChanged,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './config';
import { UserActivityService } from '../services/UserActivityService';

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Auth Methods - exactly what AuthContext.tsx expects
export const firebaseAuth = {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await this.createUserProfile(result.user);
      
      // Initialize user activity for new or existing users
      try {
        await UserActivityService.initializeUserActivity(result.user.uid);
      } catch (activityError) {
        console.warn('Failed to initialize user activity:', activityError);
        // Don't fail the login if activity initialization fails
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await this.createUserProfile(result.user);
      
      // Initialize user activity for new or existing users
      try {
        await UserActivityService.initializeUserActivity(result.user.uid);
      } catch (activityError) {
        console.warn('Failed to initialize user activity:', activityError);
        // Don't fail the login if activity initialization fails
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
      throw error;
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async createUserProfile(user: any) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        notifications: {
          emailUpdates: true,
          providerReplies: true,
          recommendations: true,
          marketing: false,
          security: true
        },
        privacy: {
          showProfilePublic: false,
          shareActivity: false,
          aiPersonalization: true,
          dataCollection: true
        }
      };
      await setDoc(userRef, userData);
    } else {
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    }
  },

  async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await this.createUserProfile(result.user);
      
      // Initialize user activity for new or existing users
      try {
        await UserActivityService.initializeUserActivity(result.user.uid);
      } catch (activityError) {
        console.warn('Failed to initialize user activity:', activityError);
        // Don't fail the login if activity initialization fails
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  },

  async signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name if provided
      if (displayName) {
        await firebaseUpdateProfile(result.user, {
          displayName: displayName
        });
      }
      
      await this.createUserProfile(result.user);
      
      // Initialize user activity for new users
      try {
        await UserActivityService.initializeUserActivity(result.user.uid);
      } catch (activityError) {
        console.warn('Failed to initialize user activity:', activityError);
        // Don't fail the signup if activity initialization fails
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
};

// User Methods - exactly what AuthContext.tsx expects
export const userService = {
  async createUserProfile(user: User) {
    try {
      const userRef = doc(db, 'users', user.uid);
      
      const userProfile = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phone: '',
        address: '',
        radiusKm: 25,
        accountType: 'Free',
        localeType: 'Urban',
        notifications: {
          emailUpdates: true,
          providerReplies: true,
          recommendations: true,
          marketing: false,
          security: true
        },
        privacy: {
          showProfilePublic: false,
          shareActivity: false,
          aiPersonalization: true,
          dataCollection: true
        },
        connectedAccounts: {
          google: user.providerData.some(provider => provider.providerId === 'google.com'),
          facebook: user.providerData.some(provider => provider.providerId === 'facebook.com')
        },
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, userProfile, { merge: true });
      
      return {
        id: user.uid,
        ...userProfile,
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  async getUserProfile(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const data = userDoc.data();
      
      return {
        id: uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        phone: data.phone || '',
        address: data.address || '',
        radiusKm: data.radiusKm || 25,
        accountType: data.accountType || 'Free',
        localeType: data.localeType || 'Urban',
        notifications: data.notifications || {
          emailUpdates: true,
          providerReplies: true,
          recommendations: true,
          marketing: false,
          security: true
        },
        privacy: data.privacy || {
          showProfilePublic: false,
          shareActivity: false,
          aiPersonalization: true,
          dataCollection: true
        },
        connectedAccounts: data.connectedAccounts || {
          google: false,
          facebook: false
        },
        lastLogin: data.lastLogin?.toDate?.() || new Date(),
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(uid: string, data: any) {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};