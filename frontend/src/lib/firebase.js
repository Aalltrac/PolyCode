import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoeks0Eba9iOPWu1BX_8rS-xsGvRmPj2M",
  authDomain: "polycode-school.firebaseapp.com",
  projectId: "polycode-school",
  storageBucket: "polycode-school.firebasestorage.app",
  messagingSenderId: "985388191664",
  appId: "1:985388191664:web:c7ceff1addfa692c605075",
  measurementId: "G-V871J517PP",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Persist sessions across reloads
setPersistence(auth, browserLocalPersistence).catch(() => {});

export const ADMIN_UID = "xjZdUktHAvQQFQFfqXSZZjkZjU83";

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
