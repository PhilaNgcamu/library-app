// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDImWWjlxH-sYsZhkiLj1FGClNdT1xx0iU",
  authDomain: "moletsane-baptist-church.firebaseapp.com",
  databaseURL: "https://moletsane-baptist-church-default-rtdb.firebaseio.com",
  projectId: "moletsane-baptist-church",
  storageBucket: "moletsane-baptist-church.appspot.com",
  messagingSenderId: "437319296672",
  appId: "1:437319296672:web:34786f926d3b4d90a40bc5",
  measurementId: "G-2GFZDPBB12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Realtime Database
const database = getDatabase(app);

export { app, auth, database };
