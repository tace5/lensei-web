import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import * as styles from "./Navigation.module.scss";

export default function Navigation() {
    return (
        <Navbar bg="secondary" className={styles["custom-nav"]}>
            <Navbar.Brand className="d-flex align-items-center" href="/"><img className="logo me-4" src="/img/logo.svg" /> <span className={"fs-2 " + styles["brand-text"]}>Squirrel</span></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav className={ "ms-auto" }>
                    <Nav.Link className={styles["custom-nav-link"]} href="/download">Download</Nav.Link>
                    <Nav.Link className={styles["custom-nav-link"]} href="/about">About</Nav.Link>
                    <Nav.Link className={styles["custom-nav-link"]} href="/partners">Partners</Nav.Link>
                    <Nav.Link className={styles["custom-nav-link"]} href="/press">Press</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}