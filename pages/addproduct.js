import React, { useState } from "react";
import { useForm } from "react-hook-form";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { firebase } from "../firebase/firebaseClient";
import { useAuth } from "../firebase/auth.js";
import axios from "axios";
import { Row, Col, Form, InputGroup, DropdownButton, Dropdown, FormControl } from "react-bootstrap";
import Layout from "../components/layout/Layout.js";
import IngredientsList from "../components/ingredientsList/IngredientsList.js";
import Map from "../components/map/Map.js";

import barcodeFormats from "../public/barcodeFormats.json";
import styles from "../styles/Addproduct.module.css";

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
        transportRating: 5
    });
    const [locations, setLocations] = useState({
        manufacturingLocation: null,
        packagingLocation: null
    })
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

    const onIngredientsListUpdate = ingredientsList => {
        setIngredientsList(ingredientsList);
        const ratingSum = ingredientsList.reduce(((sum, ingredient) => sum + parseInt(ingredient.rating)), 0);

        if (ratingSum === 0 && ingredientsList.length === 0) {
            setRatings({
                ...ratings,
                ingredientsRating: 5
            });
        } else {
            setRatings({
                ...ratings,
                ingredientsRating: Math.round(ratingSum / ingredientsList.length)
            });
        }
    }

    return (
        <Layout>
            <p>{props.message}</p>
            <div>
                <Form>
                    <Form.Group controlId="productName">
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control type="text" placeholder="Product Name" />
                    </Form.Group>
                    <Form.Label>Barcode:</Form.Label>
                    <InputGroup className="mb-xl-3">
                        <DropdownButton
                            as={InputGroup.Prepend}
                            variant="outline-secondary"
                            title="Format"
                        >
                            { barcodeFormats.map(format => {
                                return <Dropdown.Item key={format.id} value={ format.id }>{ format.name }</Dropdown.Item>
                            }) }
                        </DropdownButton>

                        <Form.Control aria-describedby="basic-addon1" placeholder="Barcode" />
                    </InputGroup>
                    <Form.Group>
                        <Form.Label>Ingredients:</Form.Label>
                        <IngredientsList
                            loadIngredientsOptions={loadIngredientsOptions}
                            updateIngredientsList={onIngredientsListUpdate}
                            ingredientsList={ingredientsList}
                        />
                        <hr />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Manufacturing & Packaging Location</Form.Label>
                                <Map locations={locations} setLocations={setLocations} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <h3 className="mb-3">Ratings:</h3>
                            <Form.Group>
                                <Form.Label>Transport Rating:</Form.Label>
                                <FormControl
                                    as="select"
                                    ref={ register }
                                    name="transport-rating"
                                    value={ratings.transportRating}
                                    onChange={ e => setRatings({ ...ratings, transportRating: parseInt(e.target.value) }) }
                                >
                                    { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nr => <option value={nr} key={ "rating-" + nr }>{ nr }</option>) }
                                </FormControl>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Company Rating:</Form.Label>
                                <FormControl
                                    as="select"
                                    ref={ register }
                                    name="company-rating"
                                    value={ratings.companyRating}
                                    onChange={ e => setRatings({ ...ratings, companyRating: parseInt(e.target.value) }) }
                                >
                                    { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nr => <option value={nr} key={ "rating-" + nr }>{ nr }</option>) }
                                </FormControl>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Packaging Rating:</Form.Label>
                                <FormControl
                                    as="select"
                                    ref={ register }
                                    name="company-rating"
                                    value={ratings.packagingRating}
                                    onChange={ e => setRatings({ ...ratings, packagingRating: parseInt(e.target.value) }) }
                                >
                                    { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nr => <option value={nr} key={ "rating-" + nr }>{ nr }</option>) }
                                </FormControl>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Overall Rating:</Form.Label>
                                <FormControl
                                    as="select"
                                    ref={ register }
                                    name="transport-rating"
                                    value={ratings.transportRating}
                                    onChange={ e => setRatings({ ...ratings, transportRating: parseInt(e.target.value) }) }
                                >
                                    { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nr => <option value={nr} key={ "rating-" + nr }>{ nr }</option>) }
                                </FormControl>
                            </Form.Group>
                        </Col>
                    </Row>
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
