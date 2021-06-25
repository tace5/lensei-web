
// Code used: https://github.com/colinhacks/next-firebase-ssr/blob/master

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

if (typeof window !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyAqdE4C87tUtAZ7gMkV6RAh0GREAPJk_18",
        authDomain: "solution-challenge-2021-1f487.firebaseapp.com",
        projectId: "solution-challenge-2021-1f487",
        storageBucket: "solution-challenge-2021-1f487.appspot.com",
        messagingSenderId: "393961054342",
        appId: "1:393961054342:web:ad21341a754afa3f8bb107",
        measurementId: "G-SFWGBNN3T7"
    });
}

export { firebase };