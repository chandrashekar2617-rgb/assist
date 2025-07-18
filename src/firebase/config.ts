// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAocUaoPWOFKL3c7k9JQe2GlvJUPV3YgOc",
  authDomain: "assist-database.firebaseapp.com",
  projectId: "assist-database",
  storageBucket: "assist-database.firebasestorage.app",
  messagingSenderId: "446540596017",
  appId: "1:446540596017:web:ca5904dd96cccb6234e610",
  measurementId: "G-MMBV6FY2WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;