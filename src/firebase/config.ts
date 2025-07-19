// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAocUaoPWOFKL3c7k9JQe2GlvJUPV3YgOc",
  authDomain: "assist-database.firebaseapp.com",
  projectId: "assist-database",
  storageBucket: "assist-database.appspot.com",
  messagingSenderId: "446540596017",
  appId: "1:446540596017:web:ca5904dd96cccb6234e610",
  measurementId: "G-MMBV6FY2WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;