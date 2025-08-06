
 // firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiXG72ZKM-Z5YlaQxTKR7zxPFdEhPay8Y",
  authDomain: "fir-class-task.firebaseapp.com",
  databaseURL: "https://fir-class-task-default-rtdb.firebaseio.com",
  projectId: "fir-class-task",
  storageBucket: "fir-class-task.appspot.com",
  messagingSenderId: "1069479573339",
  appId: "1:1069479573339:web:5dba39293b5dacf99a8c7e",
  measurementId: "G-4SVLC07Q87"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, ref, push, set, onValue };

