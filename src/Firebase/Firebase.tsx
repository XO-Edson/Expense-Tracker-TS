// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZYgc9e-OkgjiCYrmwDOmHp0jI-MXlPXE",
  authDomain: "expense-tracker-b08f3.firebaseapp.com",
  projectId: "expense-tracker-b08f3",
  storageBucket: "expense-tracker-b08f3.appspot.com",
  messagingSenderId: "974367414969",
  appId: "1:974367414969:web:e2080d90504d5c388b1968",
  measurementId: "G-TKX5ECHTSV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//const analytics = getAnalytics(app);
