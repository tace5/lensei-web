import React from "react";
import { AuthProvider } from 'shared/firebase/auth.js';
import '../styles/main.scss';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    )
}
