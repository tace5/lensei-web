import React from "react";
import { useForm } from "react-hook-form";
import { refreshToken } from "../firebase/auth.js";
import Head from 'next/head'
import styles from '../styles/Login.module.css'
import { firebase } from '../firebase/firebaseClient.js';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";
import { useRouter } from "next/router.js";

export default function Login() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const router = useRouter();

    const handleLogin = ({ email, password }) => {
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
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Snapshop - Admin Login</title>
            </Head>

            <h2 className="mb-4">Login</h2>

            <Form onSubmit={handleSubmit(handleLogin)}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control ref={register} type="email" name="email" placeholder="Enter email" isInvalid={ errors.email } />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control ref={register} type="password" name="password" placeholder="Password" isInvalid={ errors.password } />
                    { errors.password && <Form.Control.Feedback type="invalid">{ errors.password.message }</Form.Control.Feedback> }
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember Me" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}
