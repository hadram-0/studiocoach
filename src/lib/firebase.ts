// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi5CgSy9Z4C-ujBzA4lrZr1P1V2HxJEUc",
  authDomain: "firestudio-club-manager.firebaseapp.com",
  databaseURL: "https://firestudio-club-manager-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "firestudio-club-manager",
  storageBucket: "firestudio-club-manager.appspot.com",
  messagingSenderId: "516387858983",
  appId: "1:516387858983:web:9b453465b27675f100fc02",
  measurementId: "G-V02D2W2EXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
