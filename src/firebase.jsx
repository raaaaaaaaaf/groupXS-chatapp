// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAln9zDhdm15u4qjol_XyRf6Ah_66KSIWw",
  authDomain: "groupxs-chat.firebaseapp.com",
  projectId: "groupxs-chat",
  storageBucket: "groupxs-chat.appspot.com",
  messagingSenderId: "288752263536",
  appId: "1:288752263536:web:caa40632490738d2ce2fb5",
  measurementId: "G-LKMN6CZVLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage()