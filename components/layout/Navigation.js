import React from "react";
import { Form, FormControl, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { firebase } from "../../firebase/firebaseClient.js";
import { useRouter } from "next/router.js";

export default function Navigation({ user }) {
    const router = useRouter();

    const handleLogoutClick = async () => {
        await firebase
            .auth()
            .signOut()
            .then(() => {
                router.push("/");
            });
    }

    return (
        <Navbar bg="light" className="border-bottom" expand="lg">
            <Navbar.Brand href="#products">Snapshop Admin</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="Products" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/products">All Products</NavDropdown.Item>
                        <NavDropdown.Item href="/addproduct">New Product</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#suggestions">Suggestions</Nav.Link>
                    <Form className="ml-sm-2" inline>
                        <FormControl type="text" placeholder="Search Products" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Nav>
                <Navbar.Text className="mr-sm-2">User: { user ? user.email : "" }</Navbar.Text>
                <Button onClick={handleLogoutClick} className="mr-sm-2" size="sm">Sign Out</Button>
            </Navbar.Collapse>
        </Navbar>
    )
}