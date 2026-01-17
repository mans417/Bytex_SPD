import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    { key: 'apiKey', env: 'VITE_FIREBASE_API_KEY' },
    { key: 'authDomain', env: 'VITE_FIREBASE_AUTH_DOMAIN' },
    { key: 'projectId', env: 'VITE_FIREBASE_PROJECT_ID' },
    { key: 'appId', env: 'VITE_FIREBASE_APP_ID' }
  ];

  const missingFields = [];
  const invalidFields = [];

  requiredFields?.forEach(({ key, env }) => {
    const value = firebaseConfig?.[key];
    if (!value || value?.includes('your-firebase') || value?.includes('here')) {
      missingFields?.push(env);
    }
  });

  if (missingFields?.length > 0 || invalidFields?.length > 0) {
    const errorMessage = [
      '🔥 Firebase Configuration Error:',
      '',
      missingFields?.length > 0 ? `Missing or invalid environment variables:\n${missingFields?.map(f => `  - ${f}`)?.join('\n')}` : '',
      invalidFields?.length > 0 ? `Invalid format:\n${invalidFields?.map(f => `  - ${f}`)?.join('\n')}` : '',
      '',
      'To fix this:',
      '1. Go to Firebase Console: https://console.firebase.google.com/',
      '2. Select your project: SmartBill Lite',
      '3. Go to Project Settings > General',
      '4. Copy your Firebase configuration',
      '5. Update your .env file with actual values',
      '',
      'Example .env format:',
      'VITE_FIREBASE_API_KEY=AIzaSyC...',
      'VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com',
      'VITE_FIREBASE_PROJECT_ID=your-project-id',
      'VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com',
      'VITE_FIREBASE_MESSAGING_SENDER_ID=123456789',
      'VITE_FIREBASE_APP_ID=1:123456789:web:abc123'
    ]?.filter(Boolean)?.join('\n');

    console.error(errorMessage);
    return false;
  }

  return true;
};

let app = null;
let db = null;

try {
  if (validateFirebaseConfig()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Initialize Analytics if supported (safe to ignore errors in Node/Offline)
    import('firebase/analytics').then(({ getAnalytics }) => {
      try {
        const analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized');
      } catch (e) {
        console.warn('Analytics initialization failed (likely offline/unsupported env):', e);
      }
    });

    console.log('✅ Firebase (Firestore) initialized successfully');
  } else {
    console.warn('⚠️ Firebase not initialized - using mock mode');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error?.message);
  console.warn('⚠️ App will run in offline mode');
}

export { db as database }; // Export as 'database' to minimize breaking changes elsewhere for now
export default app;