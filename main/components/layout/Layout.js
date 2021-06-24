import React from "react";
import Head from 'next/head';
import Navigation from "../../components/layout/Navigation.js";

import * as styles from "./Layout.module.scss";
import {Nav, Navbar} from "react-bootstrap";

export default function Layout({ title, children }) {
    return (
        <div>
            <Head>
                <title>Squirrel - { title }</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Navigation />

            <div className={"main-section section " + styles["content"]}>
                { children }
            </div>
            <footer className={"d-flex justify-content-between " + styles["footer"]}>
                <div className="d-flex">
                    <img className={styles["logo-large"]} src="/img/logo.svg" />
                    <div className="ms-5 pt-3">
                        <h6 className={styles["footer-heading"]}>Squirrel</h6>
                        <p>A Lensei Team venture<br />
                        Copyright 2021<br />
                        All Rights Reserved</p>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <Navbar>
                        <Nav>
                            <Nav.Link href="/privacy">Privacy</Nav.Link>
                            <Nav.Link href="/contact">Contact</Nav.Link>
                            <Nav.Link href="/press">Press</Nav.Link>
                        </Nav>
                    </Navbar>
                </div>
            </footer>
        </div>
    );
}