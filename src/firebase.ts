// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfbOYcXipb9XXwp_Rmskwoxsi9kmz6nEk",
  authDomain: "babytracking-5da2a.firebaseapp.com",
  projectId: "babytracking-5da2a",
  storageBucket: "babytracking-5da2a.appspot.com",
  messagingSenderId: "670628238287",
  appId: "1:670628238287:web:3e369f78fb969d2cc3b8ba",
  measurementId: "G-3LVEE4WP7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db  = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth } // export firebase app