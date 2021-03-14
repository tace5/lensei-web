import { useState } from "react";
import { useForm } from "react-hook-form";
import { refreshToken } from "../firebase/auth.js";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { firebase } from '../firebase/firebaseClient.js';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const { register, handleSubmit } = useForm();
    const { errorMsg, setErrorMsg } = useState("");

    function checkIfAdmin(idToken) {
        axios.post('/api/auth/login', { idToken })
            .then(res => {
                if (res.status === 200) {
                    refreshToken().then(() => window.location.href = "/dashboard");
                } else if (res.status === 401) {
                    setErrorMsg("You don't have permission for this page");
                } else {
                    setErrorMsg("Something went wrong...");
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
            .catch(err => setErrorMsg(err));
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Snapshop - Admin</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
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
