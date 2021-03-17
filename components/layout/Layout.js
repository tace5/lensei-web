import React from "react";
import Head from 'next/head';
import Navigation from "./Navigation.js";

import styles from "./Layout.module.css";

export default function Layout({ title, children }) {
    return (
        <div>
            <Head>
                <title>Snapshop - { title }</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navigation />
            <div className={styles["content-wrapper"]}>
                { children }
            </div>
        </div>
    )
}