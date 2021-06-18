import React from "react";
import Head from 'next/head';
import Navigation from "../../components/layout/Navigation.js";

export default function Layout({ title, children }) {
    return (
        <div>
            <Head>
                <title>Squirrel - { title }</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Navigation />

            <div>
                { children }
            </div>
        </div>
    );
}