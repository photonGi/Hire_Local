import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

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

// Debug logging disabled for production

// Validate required fields
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
if (missingFields.length > 0) {
  console.error('[FIREBASE ERROR] Missing required fields:', missingFields);
  console.error('[FIREBASE ERROR] Current config:', firebaseConfig);
  throw new Error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | undefined;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Only initialize analytics in production and if measurementId is available
  if (firebaseConfig.measurementId && typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (analyticsError) {
      console.warn('[FIREBASE] Analytics initialization failed:', analyticsError);
    }
  }

  // Initialize Firestore with persistence enabled
  db = initializeFirestore(app, {
    cacheSizeBytes: 50 * 1024 * 1024, // 50 MB cache size
    experimentalAutoDetectLongPolling: true, // Automatically detect if long polling is needed
  });
} catch (error) {
  console.error('[FIREBASE ERROR] Failed to initialize Firebase:', error);
  throw error;
}

export { auth, analytics, db };

// Enable auth persistence
if (auth) {
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error('[FIREBASE] Auth persistence error:', error);
    });
}

export default app;