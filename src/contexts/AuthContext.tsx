import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth, userService } from '../firebase/auth';
import { User } from 'firebase/auth';
import { UserActivityService } from '../services/UserActivityService';
import { UserLocation } from '../types/firebase';

interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  address?: string;
  radiusKm?: number;
  accountType?: string;
  localeType?: string;
  location?: UserLocation;
  notifications?: {
    emailUpdates: boolean;
    providerReplies: boolean;
    recommendations: boolean;
    marketing: boolean;
    security: boolean;
  };
  privacy?: {
    showProfilePublic: boolean;
    shareActivity: boolean;
    aiPersonalization: boolean;
    dataCollection: boolean;
  };
  connectedAccounts?: {
    google: boolean;
    facebook: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  [key: string]: string | null | Date | unknown;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      try {
        // Auth state changed
        setUser(user);
        
        if (user) {
          try {
            // Wait for token to be ready with retry
            let token = null;
            for (let i = 0; i < 3; i++) {
              try {
                token = await user.getIdToken(true); // Force token refresh
                if (token) break;
              } catch (e) {
                console.warn("[AUTH] Token fetch attempt failed:", i + 1);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
              }
            }
            
            if (!token) {
              throw new Error("Failed to get valid auth token after retries");
            }
            
            // Token obtained
            
            // Attempt to get or create user profile with retries
            let profile = null;
            let retries = 0;
            while (!profile && retries < 3) {
              try {
                profile = await userService.getUserProfile(user.uid);
                if (!profile) {
                  await userService.createUserProfile(user);
                  profile = await userService.getUserProfile(user.uid);
                }
                break;
              } catch (e) {
                console.warn("[AUTH] Profile fetch/create attempt failed:", retries + 1);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
                retries++;
              }
            }
            
            if (profile) {
              setUserProfile(profile);
              
              // Initialize user activity for existing users who might not have it
              try {
                await UserActivityService.initializeUserActivity(user.uid);
              } catch (activityError) {
                console.warn('[AUTH] Failed to initialize user activity:', activityError);
                // Don't fail the auth process if activity initialization fails
              }
            } else {
              // Fall back to basic profile if Firestore operations fail
              const basicProfile: UserProfile = {
                id: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              setUserProfile(basicProfile);
            }
          } catch (error) {
            console.error('[AUTH] Error fetching/creating user profile:', error);
            // Set a basic profile with just the user's info from Firebase Auth
            const basicProfile: UserProfile = {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setUserProfile(basicProfile);
          }
        } else {
          // Clear both user and profile when logged out
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Reset state on error
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await firebaseAuth.signInWithGoogle();
      if (!result) throw new Error('No user returned from Google sign in');
      const profile = await userService.getUserProfile(result.uid);
      if (profile) {
        setUserProfile(profile as UserProfile);
      } else {
        const basicProfile: UserProfile = {
          id: result.uid,
          email: result.email,
          displayName: result.displayName,
          photoURL: result.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await firebaseAuth.signInWithFacebook();
      if (!result) throw new Error('No user returned from Facebook sign in');
      const profile = await userService.getUserProfile(result.uid);
      if (profile) {
        setUserProfile(profile as UserProfile);
      } else {
        const basicProfile: UserProfile = {
          id: result.uid,
          email: result.email,
          displayName: result.displayName,
          photoURL: result.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await firebaseAuth.signInWithEmail(email, password);
      if (!result) throw new Error('No user returned from email sign in');
      const profile = await userService.getUserProfile(result.uid);
      if (profile) {
        setUserProfile(profile as UserProfile);
      } else {
        const basicProfile: UserProfile = {
          id: result.uid,
          email: result.email,
          displayName: result.displayName,
          photoURL: result.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await firebaseAuth.signUpWithEmail(email, password, displayName);
      if (!result) throw new Error('No user returned from email sign up');
      const profile = await userService.getUserProfile(result.uid);
      if (profile) {
        setUserProfile(profile as UserProfile);
      } else {
        const basicProfile: UserProfile = {
          id: result.uid,
          email: result.email,
          displayName: result.displayName,
          photoURL: result.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await firebaseAuth.resetPassword(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await userService.updateUserProfile(user.uid, data);
      setUserProfile((prev: UserProfile | null) => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithFacebook,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// End of AuthContext
