import React from "react";
import '../styles/main.scss';
import { AuthProvider } from '../firebase/auth.js';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
