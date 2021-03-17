import React, { useState } from "react";
import { useForm } from "react-hook-form";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { firebase } from "../firebase/firebaseClient";
import { useAuth } from "../firebase/auth.js";
import axios from "axios";
import { Row, Col, Button, Form, InputGroup, DropdownButton, Dropdown, FormControl } from "react-bootstrap";
import Layout from "../components/layout/Layout.js";
import IngredientsList from "../components/ingredientsList/IngredientsList.js";
import Map from "../components/map/Map.js";

import barcodeFormats from "../public/barcodeFormats.json";

export const getServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email, admin } = token;

        if (!admin) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
                props: {},
            };
        }

        return {
            props: { message: `Your email is ${email} and your UID is ${uid}.` },
        };
    } catch (err) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
};

function AddProduct(props) {
    const [ingredientsList, setIngredientsList] = useState([]);
    const [ratings, setRatings] = useState({
        ingredientsRating: 5,
        packagingRating: 5,
        companyRating: 5,
        overallRating: 5
    });
    const [locations, setLocations] = useState({
        manufacturingLocation: null,
        packagingLocation: null
    })
    const [transportWeight, setTransportWeight] = useState(5);
    const [newProductErrors, setNewProductErrors] = useState({ name: null });

    const { register, handleSubmit } = useForm();
    const { user } = useAuth();
    const router = useRouter();

    const loadIngredientsOptions = (searchInput, cb) =>
        axios.post("/api/ingredients/search", { searchInput })
            .then(res => {
                const matchingIngredients = res.data;

                const ingredientsOptions = matchingIngredients.map(ingredient => {
                    return {
                        value: ingredient,
                        label: ingredient.label
                    }
                });

                cb(ingredientsOptions);
            })

    const onProductSubmit = ({ name, barcodeFormat, barcode, transportWeight, companyRating, packagingRating, overallRating }) => {
        axios.post("/api/products/new", {
            name,
            barcodeFormat,
            barcode,
            ingredientsList,
            manufacturingLocation: locations.manufacturingLocation,
            packagingLocation: locations.packagingLocation,
            transportWeight,
            companyRating,
            packagingRating,
            overallRating
        })
            .then(res => {
                // TODO
            })
            .catch(errors => {
                setNewProductErrors(errors.response.data);
            })
    }

    return (
        <Layout>
            <p>{props.message}</p>
            <div>
                <Form onSubmit={handleSubmit(onProductSubmit)}>
                    <Form.Group controlId="productName">
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Product Name"
                            ref={ register }
                            name="name"
                        />
                        <FormControl.Feedback type="invalid">
                            { newProductErrors.name }
                        </FormControl.Feedback>
                    </Form.Group>
                    <Form.Label>Barcode:</Form.Label>
                    <InputGroup className="mb-xl-3">
                        <Form.Control
                            as="select"
                            ref={ register }
                            name="barcodeFormat"
                            defaultValue=""
                        >
                            <option value="" disabled hidden>Format</option>
                            { barcodeFormats.map(format => <option key={ format.id } value={ format.id }>{ format.name }</option>) }
                        </Form.Control>

                        <Form.Control ref={ register } name="barcode"  aria-describedby="basic-addon1" placeholder="Barcode" />
                    </InputGroup>
                    <Form.Group controlId="ingredientsList">
                        <Form.Label>Ingredients:</Form.Label>
                        <IngredientsList
                            loadIngredientsOptions={loadIngredientsOptions}
                            updateIngredientsList={setIngredientsList}
                            ingredientsList={ingredientsList}
                        />
                        <hr />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group controlId="manufacAndPackagingLoc">
                                <Form.Label>Manufacturing & Packaging Locations:</Form.Label>
                                <Map locations={locations} setLocations={setLocations} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-5" controlId="transportWeight">
                                <Form.Label>Transport Weight: <b>{ transportWeight }</b></Form.Label>
                                <Form.Control
                                    name="transportWeight"
                                    value={ transportWeight }
                                    ref={ register }
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={0.1}
                                    onChange={e => setTransportWeight(parseFloat(e.target.value))}
                                />
                            </Form.Group>
                            <h3 className="mb-3">Ratings:</h3>
                            <Form.Group controlId="companyRating">
                                <Form.Label>Company Rating: <b>{ ratings.companyRating }</b></Form.Label>
                                <FormControl
                                    name="companyRating"
                                    value={ ratings.companyRating }
                                    ref={ register }
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    onChange={ e => setRatings({
                                        ...ratings,
                                        companyRating: e.target.value
                                    }) }
                                />
                            </Form.Group>
                            <Form.Group controlId="packagingRating">
                                <Form.Label>Packaging Rating: <b>{ ratings.packagingRating }</b></Form.Label>
                                <FormControl
                                    name="packagingRating"
                                    value={ratings.packagingRating}
                                    ref={ register }
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    onChange={ e => setRatings({
                                        ...ratings,
                                        packagingRating: e.target.value
                                    }) }
                                />
                            </Form.Group>
                            <Form.Group controlId="overallRating">
                                <Form.Label>Overall Rating: <b>{ ratings.overallRating }</b></Form.Label>
                                <FormControl
                                    name="overallRating"
                                    value={ratings.overallRating}
                                    ref={ register }
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    onChange={ e => setRatings({
                                        ...ratings,
                                        overallRating: e.target.value
                                    }) }
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="mt-4 d-flex justify-content-center"><Button size="lg">Add Product</Button></div>
                </Form>
            </div>
            <button
                onClick={async () => {
                    await firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            router.push("/");
                        });
                }}
            >
                Sign out
            </button>
        </Layout>
    );
}

export default AddProduct;
