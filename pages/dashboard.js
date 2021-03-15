import React, { useState, useEffect } from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { firebase } from "../firebase/firebaseClient";
import { useAuth } from "../firebase/auth.js";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

import barcodeFormats from "../public/barcodeFormats.json";

export const getServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email, admin } = token;

        if (!admin) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
                props: {},
            };
        }

        return {
            props: { message: `Your email is ${email} and your UID is ${uid}.` },
        };
    } catch (err) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
};

function Dashboard(props) {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <div>
            <p>{props.message}</p>
            <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control type="text" placeholder="Product Name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control type="text" placeholder="Barcode Format" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Barcode Format</Form.Label>
                        <Form.Control as="select">
                            { barcodeFormats.map(format => {
                                return <option value={ format.id }>{ format.name }</option>
                            }) }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Barcode:</Form.Label>
                        <Form.Control type="text" placeholder="Barcode Format" />
                    </Form.Group>
                    
                </Form>
            </div>
            <button
                onClick={async () => {
                    await firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            router.push("/");
                        });
                }}
            >
                Sign out
            </button>
        </div>
    );
}

export default Dashboard;
