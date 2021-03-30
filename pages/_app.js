import React from "react";
import '../styles/main.scss';
import { AuthProvider } from '../firebase/auth';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
