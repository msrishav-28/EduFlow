// Enhanced Firebase configuration for Premium SaaS Platform
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getRemoteConfig } from "firebase/remote-config";
import { getPerformance } from "firebase/performance";

// Premium Firebase configuration with all services
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const functions = getFunctions(app);
export const remoteConfig = getRemoteConfig(app);
export const performance = typeof window !== 'undefined' ? getPerformance(app) : null;

// Enhanced offline support
export const enableOfflineMode = async () => {
  try {
    await disableNetwork(db);
    console.log('🔌 Offline mode enabled');
  } catch (error) {
    console.error('Failed to enable offline mode:', error);
  }
};

export const enableOnlineMode = async () => {
  try {
    await enableNetwork(db);
    console.log('🌐 Online mode enabled');
  } catch (error) {
    console.error('Failed to enable online mode:', error);
  }
};

// Connection state management
export const monitorConnection = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => {
    enableOnlineMode();
    callback(true);
  };
  
  const handleOffline = () => {
    enableOfflineMode();
    callback(false);
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Initial state
  callback(navigator.onLine);
  
  // Cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Development emulators (only in development)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('🔧 Firebase emulators connected');
    } catch (error) {
      console.log('Emulators already connected or not available');
    }
  }
}

export default app;
