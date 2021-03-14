import { useForm } from "react-hook-form";
import { refreshToken } from "../firebase/auth.js";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { firebase } from '../firebase/firebaseClient.js';
import axios from 'axios';

function checkIfAdmin(idToken) {
    console.log(idToken);
    axios.post('/api/auth/login', { idToken })
        .then(res => {
            console.log(res)
            if (res.status === 200) {
                refreshToken().then(() => window.location.href = "/dashboard");
            } else if (res.status === 401) {
                console.log("You don't have permission for this page")
            } else {
                console.log("Something went wrong...")
            }
        });
}

function handleLogin({ email, password }) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            refreshToken().then(idToken => {
                checkIfAdmin(idToken);
            })
        })
        .catch(err => console.log(err));
}

export default function Home() {
    const { register, handleSubmit } = useForm();

    return (
        <div className={styles.container}>
            <Head>
                <title>Snapshop - Admin</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <form onSubmit={handleSubmit(handleLogin)}>
                <label>Email:</label>
                <input ref={register} type="email" name="email" />
                <label htmlFor="password">Password:</label>
                <input ref={register} type="password" id="password" name="password"/>
                <button>Login</button>
            </form>
        </div>
    )
}
