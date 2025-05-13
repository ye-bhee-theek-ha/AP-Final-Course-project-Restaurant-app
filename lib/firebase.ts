
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlqYVdlWNVXcI0WIM-C_QfcgveTY4MOGc",
  authDomain: "approject-156b1.firebaseapp.com",
  projectId: "approject-156b1",
  storageBucket: "approject-156b1.firebasestorage.app",
  messagingSenderId: "229551897019",
  appId: "1:229551897019:web:99c1819ae686a47a73ac9e"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If already initialized, use that app
}

const db = getFirestore(app);

export { app, db};

