// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYDwXKYx13P8WW0qZCiDce2xcPA8QvckY",
  authDomain: "projectbonus-f12a0.firebaseapp.com",
  projectId: "projectbonus-f12a0",
  storageBucket: "projectbonus-f12a0.firebasestorage.app",
  messagingSenderId: "1062116806562",
  appId: "1:1062116806562:web:42cfe612b8f123115e6cfb"
};


// 👇 This makes sure Firebase doesn’t re-initialize on web refresh
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
