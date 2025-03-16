// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjzqKHrJKgDI11mMaJFHMTFGgAxG3_CQM",
  authDomain: "task-list-7da4a.firebaseapp.com",
  projectId: "task-list-7da4a",
  storageBucket: "task-list-7da4a.firebasestorage.app",
  messagingSenderId: "385898980181",
  appId: "1:385898980181:web:2046064c1b66501e4485dc"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export both db and auth
export { db, auth };