import React from "react";
import { Form, FormControl, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function Navigation({ user }) {
    return (
        <Navbar bg="light" className="border-bottom" expand="lg">
            <Navbar.Brand href="#products">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="Products" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#products">All Products</NavDropdown.Item>
                        <NavDropdown.Item href="#products">New Product</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#suggestions">Suggestions</Nav.Link>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search Products" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}