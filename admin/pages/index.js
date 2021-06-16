import React from "react";
import { useForm } from "react-hook-form";
import { refreshToken } from "../../shared/firebase/auth.js";
import Head from 'next/head'
import styles from '../styles/pages/Login.module.scss'
import { firebase } from '../../shared/firebase/firebaseClient.js';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";
import { useRouter } from "next/router.js";

export default function Login() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const router = useRouter();

    const handleLogin = ({ email, password, remember }) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => refreshToken())
            .then(idToken => axios.post('/api/auth/login', { idToken }))
            .then(res => {
                if (res.status === 200) {
                    router.push("/products")
                }
            })
            .catch(err => {
                if ((err.response && err.response.status === 401) || err.code) {
                    const loginError = {
                        type: "server",
                        message: "Wrong email or password"
                    };

                    setError("email", loginError);
                    setError("password", loginError);
                }
            });

        firebase.auth().setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Lensei - Admin Portal</title>
            </Head>

            <img style={{ width: 200 }} className="mb-5 mt-5" src="/logo-white.svg" />

            <div className={styles["login-wrapper"]}>
                <h2 className="mb-4">Sign In</h2>

                <div className={styles.login}>
                    <Form className={styles["login-form"]} onSubmit={handleSubmit(handleLogin)}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control ref={ register } type="email" name="email" placeholder="Enter email" isInvalid={ errors.email } />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control ref={ register } type="password" name="password" placeholder="Password" isInvalid={ errors.password } />
                            { errors.password && <Form.Control.Feedback type="invalid">{ errors.password.message }</Form.Control.Feedback> }
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check ref={ register } type="checkbox" name="remember" label="Remember Me" />
                        </Form.Group>
                        <div className="mt-4 d-flex justify-content-center"><Button variant="primary" type="submit">Submit</Button></div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
