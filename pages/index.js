import React  from "react";
import { useForm } from "react-hook-form";
import { refreshToken } from "../firebase/auth.js";
import Head from 'next/head'
import styles from '../styles/Login.module.css'
import { firebase } from '../firebase/firebaseClient.js';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";
import { useRouter } from "next/router.js";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const checkIfAdmin = (idToken) => {
        axios.post('/api/auth/login', { idToken })
            .then(res => {
                if (res.status === 200) {
                    refreshToken().then(() => router.push("/addproduct"));
                } else if (res.status === 401) {
                    console.log("You don't have permission for this page");
                } else {
                    console.log("Something went wrong...");
                }
            });
    }



    const handleLogin = ({ email, password }) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                refreshToken().then(idToken => {
                    checkIfAdmin(idToken);
                })
            })
            .catch(err => {
                console.log(err.message)
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
                    <Form.Control ref={register} type="email" name="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control ref={register} type="password" name="password" placeholder="Password" />
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
