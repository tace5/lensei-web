import React, { useState } from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import barcodeFormats from "../../public/barcode_formats.json";
import IngredientsList from "../ingredientsList/IngredientsList.js";
import Map from "../map/Map.js";
import axios from "axios";
import { useForm } from "react-hook-form";
import styles from "./ProductForm.module.scss";
import { calcRatingColor } from "../../helpers/rating.js";

export default function ProductForm({ onSubmit, formData, submitBtnText }) {
    const {
        ingredients,
        manufacturingLoc,
        packagingLoc,
        ...otherFormData
    } = formData;

    const [ingredientsList, setIngredientsList] = useState(ingredients);
    const [locations, setLocations] = useState({
        manufacturingLoc,
        packagingLoc
    })
    const [sliderVals, setSliderVals] = useState({
        transportWeight: formData.transportWeight,
        companyRating: formData.companyRating,
        packagingRating: formData.packagingRating,
        overallRating: formData.overallRating
    })

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
                        label: ingredient.label
                    }
                });

                cb(ingredientsOptions);
            })

    const onProductSubmit = (formData) => {
        console.log(formData);
        onSubmit({
            ...formData,
            ingredientsList,
            locations
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
            <Row>
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
                    <Form.Group controlId="price">
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            type="number"
                            step={0.01}
                            placeholder="Product Price"
                            ref={ register }
                            name="price"
                            isInvalid={ errors.price }
                        />
                        { errors.price && <FormControl.Feedback type="invalid">{ errors.price.message }</FormControl.Feedback> }
                    </Form.Group>
                </Col>
            </Row>
            <Form.Label>Barcode:</Form.Label>
            <InputGroup className="mb-xl-3">
                <Form.Control
                    as="select"
                    ref={ register }
                    name="barcodeFormat"
                    isInvalid={ errors.barcode }
                    style={{ backgroundImage: "none" }}
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
                    isInvalid={ errors.barcode }
                />
                { errors.barcode && <FormControl.Feedback type="invalid">{ errors.barcode.message }</FormControl.Feedback> }
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
                        <Map
                            locations={locations}
                            setLocations={setLocations}
                            errors={{ manufacturingLoc: errors.manufacturingLoc, packagingLoc: errors.packagingLoc }}
                            clearErrors={() => clearErrors(["manufacturingLoc", "packagingLoc"])}
                        />
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="transportWeight">
                        <Form.Label>Transport Weight: <b>{ sliderVals.transportWeight }</b></Form.Label>
                        <Form.Control
                            defaultValue={sliderVals.transportWeight}
                            name="transportWeight"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={0.1}
                            onChange={e => setSliderVals({ ...sliderVals, transportWeight: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <h3 className="mb-3">Ratings:</h3>
                    <Form.Group controlId="companyRating">
                        <Form.Label className="d-flex align-items-center">
                            Company:
                            <div className={calcRatingColor(sliderVals.companyRating) + " ml-2 border " + styles["rating"]}>{ sliderVals.companyRating }</div>
                        </Form.Label>
                        <FormControl
                            defaultValue={sliderVals.companyRating}
                            name="companyRating"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            onChange={e => setSliderVals({ ...sliderVals, companyRating: e.target.value })}
                        />
                        <Form.Control
                            className="mt-3"
                            type="text"
                            placeholder="Company Name"
                            ref={ register }
                            name="companyName"
                            isInvalid={ errors.companyName }
                        />
                        { errors.companyName && <FormControl.Feedback type="invalid">{ errors.companyName.message }</FormControl.Feedback> }
                        <FormControl className="mt-3" placeholder="Explanation" as="textarea" ref={ register } name="companyRatingRationale" isInvalid={errors.companyRatingRationale} />
                        { errors.companyRatingRationale && <FormControl.Feedback type="invalid">{ errors.companyRatingRationale.message }</FormControl.Feedback> }
                    </Form.Group>
                    <Form.Group controlId="packagingRating">
                        <Form.Label className="d-flex align-items-center">
                            Packaging:
                            <div
                                className={calcRatingColor(sliderVals.packagingRating) + " ml-2 border " + styles["rating"]}
                            >{ sliderVals.packagingRating }</div>
                        </Form.Label>
                        <FormControl
                            defaultValue={sliderVals.packagingRating}
                            name="packagingRating"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            onChange={e => setSliderVals({ ...sliderVals, packagingRating: e.target.value })}
                        />
                        <FormControl className="mt-3" placeholder="Explanation" as="textarea" ref={ register } name="packagingRatingRationale" isInvalid={errors.packagingRatingRationale} />
                        { errors.packagingRatingRationale && <FormControl.Feedback type="invalid">{ errors.packagingRatingRationale.message }</FormControl.Feedback> }
                    </Form.Group>
                    <Form.Group controlId="overallRating">
                        <Form.Label className="d-flex align-items-center">
                            Overall:
                            <div
                                className={calcRatingColor(sliderVals.overallRating) + " ml-2 border " + styles["rating"]}
                            >{ sliderVals.overallRating }</div>
                        </Form.Label>
                        <FormControl
                            defaultValue={sliderVals.overallRating}
                            name="overallRating"
                            ref={ register }
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            onChange={e => setSliderVals({ ...sliderVals, overallRating: e.target.value })}
                        />
                        <FormControl className="mt-3" placeholder="Explanation" as="textarea" ref={ register } name="overallRatingRationale" isInvalid={errors.overallRatingRationale} />
                        { errors.overallRatingRationale && <FormControl.Feedback type="invalid">{ errors.overallRatingRationale.message }</FormControl.Feedback> }
                    </Form.Group>
                </Col>
            </Row>
            <div className="mt-4 d-flex justify-content-center"><Button type="submit" size="lg">{ submitBtnText }</Button></div>
        </Form>
    )
}