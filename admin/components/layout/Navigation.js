import React from "react";
import { Form, FormControl, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { firebase } from "shared/firebase/firebaseClient.js";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import * as styles from "./Navigation.module.scss";

export default function Navigation({ user }) {
    const { handleSubmit, register } = useForm();
    const router = useRouter();

    const handleLogoutClick = async () => {
        await firebase
            .auth()
            .signOut()
            .then(() => {
                router.push("/");
            });
    }

    const handleProductSearch = ({ searchInput }) => {
        if (router.pathname === "/products") {
            window.location.href = "/products?searchInput=" + searchInput;
        } else {
            router.push({
                pathname: "/products",
                query: { searchInput }
            })
        }
    }

    return (
        <Navbar bg="primary" className={ "border-bottom navbar-light px-3 " + styles.navbar } expand="lg">
            <Navbar.Brand href="/products"><img className="logo-white" src="/logo-white.svg" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title="Products" id="basic-nav-dropdown">
                        <NavDropdown.Item className={styles["navbar-dropdown-item"]} href="/products">All Products</NavDropdown.Item>
                        <NavDropdown.Item className={styles["navbar-dropdown-item"]} href="/products/new">New Product</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/suggestions">Suggestions</Nav.Link>
                    <Form onSubmit={ handleSubmit(handleProductSearch) } className="ms-sm-2 d-flex" inline>
                        <FormControl name="searchInput" ref={ register } type="text" placeholder="Search Products" className={"me-sm-2 " + styles["product-search"]} />
                        <Button type="submit" className="btn-primary">SEARCH</Button>
                    </Form>
                </Nav>
                <Navbar.Text className="me-sm-2">User: { user ? user.email : "" }</Navbar.Text>
                <Button onClick={handleLogoutClick} className="me-sm-2 btn-primary">SIGN OUT</Button>
            </Navbar.Collapse>
        </Navbar>
    )
}