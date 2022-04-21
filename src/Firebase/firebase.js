// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNBl_oweDKMbWWeenJ3fxLCGu6mq7kxh0",
    authDomain: "tripus-c3dc5.firebaseapp.com",
    projectId: "tripus-c3dc5",
    storageBucket: "tripus-c3dc5.appspot.com",
    messagingSenderId: "99993024725",
    appId: "1:99993024725:web:9c9a2a9659a7e1e7530a5c",
    measurementId: "G-X3TEJVGXHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        return user.email
    } catch (err) {
        console.error(err);
        return null
        //alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
}

export {
  auth,
  signInWithGoogle,
  logout,
};