// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD6jA8VvUmRI9D20T_CWBzs_8K1GmigMw",
  authDomain: "myresume-115cf.firebaseapp.com",
  projectId: "myresume-115cf",
  storageBucket: "myresume-115cf.firebasestorage.app",
  messagingSenderId: "1005430426473",
  appId: "1:1005430426473:web:b9a6563bf682c070cc4bf8",
  measurementId: "G-BT23GXGK9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };