import React, { useState, useEffect } from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { firebase } from "../firebase/firebaseClient";
import { useAuth } from "../firebase/auth.js";
import axios from "axios";

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
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        axios("/api/suggestions").then(result => setSuggestions(result.data));
    }, [])

    return (
        <div>
            { suggestions?.map(suggestion => {
                return suggestion.code
            }) }
            <p>{props.message}</p>
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
