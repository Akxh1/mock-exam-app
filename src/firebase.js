import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOgyfbtAP2StxHMUkV4kwmL3X4j_Y719c",
    authDomain: "mockexamstudentdata.firebaseapp.com",
    projectId: "mockexamstudentdata",
    storageBucket: "mockexamstudentdata.firebasestorage.app",
    messagingSenderId: "1059383339474",
    appId: "1:1059383339474:web:bf68633b0fe922e92a000b",
    measurementId: "G-2670EVZHFE"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);