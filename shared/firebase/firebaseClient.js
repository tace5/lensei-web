
// Code used: https://github.com/colinhacks/next-firebase-ssr/blob/master

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

if (typeof window !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyDMbZyh9g_oUQF-hIr-xZxnVxO4x5hKe6A",
        authDomain: "squirrel-c9d23.firebaseapp.com",
        projectId: "squirrel-c9d23",
        storageBucket: "squirrel-c9d23.appspot.com",
        messagingSenderId: "4554017962",
        appId: "1:4554017962:web:dacfd831a6bc158123d4d3",
        measurementId: "G-L1NRNRRVZD"
    });
}

export { firebase };