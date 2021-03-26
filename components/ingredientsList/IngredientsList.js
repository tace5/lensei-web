import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async'
import IngredientsListItem from "./IngredientsListItem.js";
import { Row, Col, Accordion, Button, FormControl, FormLabel, InputGroup } from "react-bootstrap";

import styles from "./IngredientsList.module.css";
import axios from "axios";
import {calcRatingColor} from "../../helpers/rating.js";

export default function IngredientsList({ loadIngredientsOptions, updateIngredientsList, ingredientsList }) {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

    const [selectedOption, setSelectedOption] = useState(null);
    const [newIngredientRating, setNewIngredientRating] = useState(5);

    const handleSelect = ingredientOption => {
        updateIngredientsList([
            ...ingredientsList,
            ingredientOption.value
        ])
        setSelectedOption(null);
    }

    const filterOption = option => {
        return !ingredientsList.find(ingredient => ingredient.id === option.value.id)
    }

    const onIngredientRemove = ingredientId => {
        updateIngredientsList(ingredientsList.filter(ingredient => ingredient.id !== ingredientId));
    }

    const handleSubmitIngredient = ({ name, rating, description }) => {
        const data = { name, rating: parseInt(rating), description };

        axios.post("/api/ingredients", data)
            .then(res => {
                const newIngredient = res.data;

                updateIngredientsList([
                    ...ingredientsList,
                    newIngredient
                ])

                reset({ name: "", rating: 5, description: ""});
            })
            .catch(err => {
                const errors = err.response.data;

                if (errors.name) {
                    setError("name", {
                        type: "server",
                        message: errors.name
                    })
                }
            });
    }

    return (
        <div>
            <Accordion>
                <div className={ styles["ingredients-search-container"] }>
                    <div className={ styles["ingredients-search"] }>
                        <AsyncSelect
                            placeholder="Search..."
                            instanceId="ingredients-search"
                            value={ selectedOption }
                            cacheOptions
                            loadOptions={ (searchInput, cb) => loadIngredientsOptions(searchInput, cb, ingredientsList) }
                            filterOption={ filterOption }
                            onChange={ handleSelect }
                        />
                    </div>
                    <Accordion.Toggle as={Button} eventKey="new-ingredient">New Ingredient</Accordion.Toggle>
                </div>
                <div className={ styles["new-ingredient-container"] }>
                    <Accordion.Collapse eventKey="new-ingredient">
                        <div className={ styles["new-ingredient-form"] }>
                            <Row className="m-3 mb-4">
                                <Col>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Name:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            ref={ register }
                                            name="name"
                                            placeholder="Ingredient Name"
                                            isInvalid={ errors.name }
                                        />
                                        { errors.name && <FormControl.Feedback type="invalid">{ errors.name.message }</FormControl.Feedback> }
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <FormLabel className="d-flex align-items-center">
                                            Rating:
                                            <div
                                                className={"ml-2 border " + styles["ingredient-rating"]}
                                                style={{backgroundColor: calcRatingColor(newIngredientRating)}}
                                            >{ newIngredientRating }</div>
                                        </FormLabel>
                                        <FormControl
                                            name="rating"
                                            ref={ register }
                                            type="range"
                                            value={ newIngredientRating }
                                            min={1}
                                            max={10}
                                            step={1}
                                            onChange={ e => setNewIngredientRating(parseInt(e.target.value)) }
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="m-3">
                                <Col>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Description:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl as="textarea" ref={ register } name="description" />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <div className={ styles["new-ingredient-form-btn-container"] }>
                                <Button onClick={ handleSubmit(handleSubmitIngredient) }>Submit</Button>
                            </div>
                        </div>
                    </Accordion.Collapse>
                </div>
            </Accordion>


            <Accordion>
                { ingredientsList.length > 0
                    ? ingredientsList.map(ingredient => <IngredientsListItem key={ ingredient.id } ingredient={ ingredient } onRemove={ onIngredientRemove } />)
                    : <span className={ styles["ingredients-list-msg"] }>No ingredients</span> }
            </Accordion>
        </div>
    )
}