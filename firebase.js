// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjawAzcWE8Wo6YWwckoXbX57BLoNfK8I4",
  authDomain: "bonusproject-66ded.firebaseapp.com",
  projectId: "bonusproject-66ded",
  storageBucket: "bonusproject-66ded.firebasestorage.app",
  messagingSenderId: "123375955493",
  appId: "1:123375955493:web:3703275bb236cc7718d9cc",
  measurementId: "G-VHL6CWLX68"
};


// 👇 This makes sure Firebase doesn’t re-initialize on web refresh
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
