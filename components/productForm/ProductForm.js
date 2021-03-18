import {Button, Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import barcodeFormats from "../../public/barcodeFormats.json";
import IngredientsList from "../ingredientsList/IngredientsList.js";
import Map from "../map/Map.js";
import React, {useState} from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function ProductForm({ onSubmit, errors, formData, type }) {
    const {
        ingredients,
        manufacturingLocation,
        packagingLocation,
        ...otherFormData
    } = formData;

    const [ingredientsList, setIngredientsList] = useState(ingredients);
    const [locations, setLocations] = useState({
        manufacturingLocation,
        packagingLocation
    })

    const { register, handleSubmit, watch } = useForm({
        defaultValues: otherFormData
    });

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

    const onProductSubmit = (formData) => {
        onSubmit({
            ...formData,
            ingredientsList,
            locations
        })
    }

    return (
        <Form onSubmit={handleSubmit(onProductSubmit)}>
            <Row>
                <Col>
                    <Form.Group controlId="productName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Product Name"
                            ref={ register }
                            name="name"
                        />
                        <FormControl.Feedback type="invalid">
                            { errors.name }
                        </FormControl.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="price">
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            type="number"
                            step={0.01}
                            placeholder="Product Price"
                            ref={ register }
                            name="price"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Label>Barcode:</Form.Label>
            <InputGroup className="mb-xl-3">
                <Form.Control
                    as="select"
                    ref={ register }
                    name="barcodeFormat"
                >
                    <option value="" disabled hidden>Format</option>
                    { barcodeFormats.map(format => <option key={ format.id } value={ format.id }>{ format.name }</option>) }
                </Form.Control>

                <Form.Control
                    className="w-50"
                    ref={ register }
                    name="barcode"
                    aria-describedby="basic-addon1"
                    placeholder="Barcode"
                />
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
                        <Form.Label>Transport Weight: <b>{ watch("transportWeight") }</b></Form.Label>
                        <Form.Control
                            name="transportWeight"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={0.1}
                        />
                    </Form.Group>
                    <h3 className="mb-3">Ratings:</h3>
                    <Form.Group controlId="companyRating">
                        <Form.Label>Company Rating: <b>{ watch("companyRating") }</b></Form.Label>
                        <FormControl
                            name="companyRating"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                        />
                    </Form.Group>
                    <Form.Group controlId="packagingRating">
                        <Form.Label>Packaging Rating: <b>{ watch("packagingRating") }</b></Form.Label>
                        <FormControl
                            name="packagingRating"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                        />
                    </Form.Group>
                    <Form.Group controlId="overallRating">
                        <Form.Label>Overall Rating: <b>{ watch("overallRating") }</b></Form.Label>
                        <FormControl
                            name="overallRating"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <div className="mt-4 d-flex justify-content-center"><Button type="submit" size="lg">{ type === "add" ? "Add" : "Update" } Product</Button></div>
        </Form>
    )
}