import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { initializeFirestore } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';

// Helper function to get environment variable with fallback
const getEnvVar = (key: string): string => {
  // Try import.meta.env first (Vite default)
  let value = import.meta.env[key];
  
  // Fallback to process.env if available
  if (!value && typeof process !== 'undefined' && process.env) {
    value = process.env[key];
  }
  
  // Additional fallback for window env (if set by build process)
  if (!value && typeof window !== 'undefined' && (window as any).env) {
    value = (window as any).env[key];
  }
  
  return value || '';
};

export const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  databaseURL: getEnvVar('VITE_FIREBASE_DATABASE_URL'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID')
};

// Debug logging for production issues
console.log('[FIREBASE DEBUG] Environment variables check:');
console.log('API Key exists:', !!firebaseConfig.apiKey);
console.log('API Key length:', firebaseConfig.apiKey?.length || 0);
console.log('API Key preview:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'undefined');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('import.meta.env keys:', Object.keys(import.meta.env || {}).filter(key => key.startsWith('VITE_FIREBASE')));
console.log('process.env available:', typeof process !== 'undefined' && !!process.env);

// Validate required fields
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
if (missingFields.length > 0) {
  console.error('[FIREBASE ERROR] Missing required fields:', missingFields);
  console.error('[FIREBASE ERROR] Current config:', firebaseConfig);
  throw new Error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let app;
let auth;
let analytics;
let db;

try {
  console.log('[FIREBASE] Initializing Firebase with config:', JSON.stringify(firebaseConfig, null, 2));
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Only initialize analytics in production and if measurementId is available
  if (firebaseConfig.measurementId && typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log('[FIREBASE] Analytics initialized');
    } catch (analyticsError) {
      console.warn('[FIREBASE] Analytics initialization failed:', analyticsError);
    }
  }

  // Initialize Firestore with persistence enabled
  db = initializeFirestore(app, {
    cacheSizeBytes: 50 * 1024 * 1024, // 50 MB cache size
    experimentalAutoDetectLongPolling: true, // Automatically detect if long polling is needed
  });

  console.log('[FIREBASE] Successfully connected to Firebase');
} catch (error) {
  console.error('[FIREBASE ERROR] Failed to initialize Firebase:', error);
  console.error('[FIREBASE ERROR] Config used:', firebaseConfig);
  throw error;
}

export { auth, analytics, db };

// Enable auth persistence
if (auth) {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('[FIREBASE] Auth persistence enabled');
    })
    .catch((error) => {
      console.error('[FIREBASE] Auth persistence error:', error);
    });

  // Monitor auth state
  onAuthStateChanged(auth, (user) => {
    console.log('[FIREBASE] Auth state changed:', user ? 'Logged in' : 'Logged out');
    if (user) {
      // Force token refresh on auth state change
      user.getIdToken(true)
        .then(() => console.log('[FIREBASE] Token refreshed'))
        .catch(error => console.error('[FIREBASE] Token refresh failed:', error));
    }
  });
}

export default app;