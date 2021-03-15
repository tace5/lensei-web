import React from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { firebase } from "../firebase/firebaseClient";

export const getServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email } = token;

        console.log(token);
        return {
            props: { message: `Your email is ${email} and your UID is ${uid}.` },
        };
    } catch (err) {
        console.log(err);
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
};

function AuthenticatedPage(props) {
    const router = useRouter();

    return (
        <div>
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

export default AuthenticatedPage;
