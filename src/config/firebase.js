// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIdCV0Rv9t7UCcmlnae77hEM1BxUVH90k",
  authDomain: "fir-reactv1.firebaseapp.com",
  projectId: "fir-reactv1",
  storageBucket: "fir-reactv1.appspot.com",
  messagingSenderId: "44119035882",
  appId: "1:44119035882:web:d95dc47158210cb07fac93",
  measurementId: "G-C8PW64PYX0"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);
export { auth, db, storage }
