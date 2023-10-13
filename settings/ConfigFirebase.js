// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-ZlT1oPfmYanMyV16pPUKPKsKJUFmkGk",
  authDomain: "zaneari-app.firebaseapp.com",
  projectId: "zaneari-app",
  storageBucket: "zaneari-app.appspot.com",
  messagingSenderId: "18655343193",
  appId: "1:18655343193:web:92be3dfd578f8d9abbf748"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;