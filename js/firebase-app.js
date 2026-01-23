// Firebase initialization placeholder (uses Firebase v8 compat API)
// IMPORTANT: Replace the firebaseConfig values with your actual project config
// See FIREBASE_SETUP.md for instructions

try {
  // Provide a minimal check to avoid errors when script included without Firebase CDN
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded. Ensure you included Firebase CDN scripts before firebase-app.js');
  }
} catch (e) {
  console.warn('Firebase check failed', e);
}

// Replace the following with your real config from Firebase Console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi-N6RzczdoNvMalpX9O0v6vz7JvvaQ_4",
  authDomain: "chocodream-30b73.firebaseapp.com",
  databaseURL: "https://chocodream-30b73-default-rtdb.firebaseio.com",
  projectId: "chocodream-30b73",
  storageBucket: "chocodream-30b73.firebasestorage.app",
  messagingSenderId: "1072238144915",
  appId: "1:1072238144915:web:3d716100e74a32d1c98c66",
  measurementId: "G-VNG183RB9Q"
};

// Initialize Firebase if available
if (typeof firebase !== 'undefined' && firebase && !firebase.apps?.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized');
  } catch (err) {
    console.error('Error initializing Firebase:', err);
  }
}

// Export placeholders to the global scope so other scripts can use them (v8 compat)
window.__choco_firebase_config = firebaseConfig;
