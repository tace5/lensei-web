import React from "react";
import { Form, FormControl, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { firebase } from "../../firebase/firebaseClient.js";
import { useRouter } from "next/router.js";
import {useForm} from "react-hook-form";

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
        <Navbar bg="light" className="border-bottom" expand="lg">
            <Navbar.Brand href="#products">Snapshop Admin</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="Products" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/products">All Products</NavDropdown.Item>
                        <NavDropdown.Item href="/products/new">New Product</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#suggestions">Suggestions</Nav.Link>
                    <Form onSubmit={ handleSubmit(handleProductSearch) } className="ml-sm-2" inline>
                        <FormControl name="searchInput" ref={ register } type="text" placeholder="Search Products" className="mr-sm-2" />
                        <Button type="submit" variant="outline-success">Search</Button>
                    </Form>
                </Nav>
                <Navbar.Text className="mr-sm-2">User: { user ? user.email : "" }</Navbar.Text>
                <Button onClick={handleLogoutClick} className="mr-sm-2" size="sm">Sign Out</Button>
            </Navbar.Collapse>
        </Navbar>
    )
}