// Import the functions you need from the SDKs you need
import firebase from 'firebase';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1Ycnq_7A4vARb1Z_95kW_Vp9048N_YkA",
    authDomain: "workout-d940d.firebaseapp.com",
    projectId: "workout-d940d",
    storageBucket: "workout-d940d.appspot.com",
    messagingSenderId: "71267235541",
    appId: "1:71267235541:web:870a8d9bdcc2402120945c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export { auth };