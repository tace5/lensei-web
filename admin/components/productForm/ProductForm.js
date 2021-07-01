import React, { useState } from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import barcodeFormats from "../../public/barcode_formats.json";
import IngredientsList from "../ingredientsList/IngredientsList.js";
import Map from "../map/Map.js";
import axios from "axios";
import { useForm } from "react-hook-form";
import MultiSelect from 'multiselect-react-dropdown';

export default function ProductForm({ onSubmit, formData, submitBtnText, producers, tags, packagings }) {
    const {
        ingredients,
        producedAt,
        ...otherFormData
    } = formData;

    const [ingredientsList, setIngredientsList] = useState(ingredients);
    const [location, setLocation] = useState(producedAt);

    const { register, handleSubmit, setError, formState: { errors }, clearErrors } = useForm({
        defaultValues: otherFormData
    });

    const loadIngredientsOptions = (searchInput, cb) =>
        axios.get("/api/ingredients", { params: { searchInput } })
            .then(res => {
                const matchingIngredients = res.data;

                const ingredientsOptions = matchingIngredients.map(ingredient => {
                    return {
                        value: ingredient,
                        label: ingredient.name
                    }
                });

                cb(ingredientsOptions);
            })

    const onProductSubmit = (formData) => {
        console.log(formData);
        onSubmit({
            ...formData,
            ingredientsList,
            createdAt: location
        })
            .catch(err => {
                const errors = err.response.data;
                console.log(errors);
                errors.forEach(error => {
                    setError(error.path, {
                        type: error.type,
                        message: error.message
                    })
                })
            });
    }

    return (
        <Form onSubmit={handleSubmit(onProductSubmit)}>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="productName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Product Name"
                            ref={ register }
                            name="name"
                            isInvalid={ errors.name }
                        />
                        { errors.name && <FormControl.Feedback type="invalid">{ errors.name.message }</FormControl.Feedback> }
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="producer">
                        <Form.Label>Producer:</Form.Label>
                        <Form.Control
                            className="mb-3"
                            as="select"
                            ref={register}
                            name="producer"
                        >
                            <option value="" disabled hidden>Producer</option>
                            { producers.map(producer => <option key={ producer.id } value={ producer.id }>{producer.name}</option>) }
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Label>Barcode:</Form.Label>
            <InputGroup className="mb-xl-3">
                <Form.Control
                    as="select"
                    ref={ register }
                    name="format"
                    isInvalid={ errors.code }
                >
                    <option value="" disabled hidden>Format</option>
                    { barcodeFormats.map(format => <option key={ format.id } value={ format.id }>{ format.name }</option>) }
                </Form.Control>

                <Form.Control
                    className="w-50"
                    ref={ register }
                    name="code"
                    aria-describedby="basic-addon1"
                    placeholder="Barcode"
                    isInvalid={ errors.code }
                />
                { errors.code && <FormControl.Feedback type="invalid">{ errors.code.message }</FormControl.Feedback> }
            </InputGroup>
            <Form.Group className="mb-3" controlId="productName">
                <Form.Label>Summary:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Summary"
                    ref={ register }
                    name="summary"
                    isInvalid={ errors.summary }
                />
                { errors.name && <FormControl.Feedback type="invalid">{ errors.name.message }</FormControl.Feedback> }
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tags:</Form.Label>
                <MultiSelect options={tags} displayValue="name" ref={ register } />
            </Form.Group>
            <Form.Group controlId="ingredientsList">
                <Form.Label>Ingredients:</Form.Label>
                <IngredientsList
                    loadIngredientsOptions={loadIngredientsOptions}
                    updateIngredientsList={setIngredientsList}
                    ingredientsList={ingredientsList}
                />
                <hr />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Packaging:</Form.Label>
                <MultiSelect options={packagings} displayValue="name" />
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group controlId="productionLoc">
                        <Form.Label>Production Location:</Form.Label>
                        <Map
                            location={location}
                            setLocation={setLocation}
                            error={errors.producedAt}
                            clearErrors={() => clearErrors(["manufacturingLoc", "packagingLoc"])}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <div className="mt-4 d-flex justify-content-center"><Button type="submit" size="lg">{ submitBtnText }</Button></div>
        </Form>
    )
}