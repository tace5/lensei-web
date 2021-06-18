import React from "react";
import {Nav, Navbar} from "react-bootstrap";

export default function Navigation() {
    return (
        <Navbar bg="secondary">
            <Navbar.Brand href="/"><img className="logo" src="/logo.svg" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse >
                <Nav className={ "ms-auto" }>
                    <Nav.Link href="/download">Download</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/partners">Partners</Nav.Link>
                    <Nav.Link href="/press">Press</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}