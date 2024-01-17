import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCZYgc9e-OkgjiCYrmwDOmHp0jI-MXlPXE",
  authDomain: "expense-tracker-b08f3.firebaseapp.com",
  projectId: "expense-tracker-b08f3",
  storageBucket: "expense-tracker-b08f3.appspot.com",
  messagingSenderId: "974367414969",
  appId: "1:974367414969:web:e2080d90504d5c388b1968",
  measurementId: "G-TKX5ECHTSV",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//const analytics = getAnalytics(app);
