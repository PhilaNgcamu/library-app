import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDA64eSyGYdJ4l5Fjn4u_OMDMZmNN2QZ8M",
  authDomain: "moletsane-baptist-church.firebaseapp.com",
  databaseURL: "https://moletsane-baptist-church-default-rtdb.firebaseio.com",
  projectId: "moletsane-baptist-church",
  storageBucket: "moletsane-baptist-church.appspot.com",
  messagingSenderId: "437319296672",
  appId: "1:437319296672:web:7a57af121ef4f607a40bc5",
  measurementId: "G-HSRXGDT7GM",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
