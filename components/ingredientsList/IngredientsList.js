import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async'
import IngredientsListItem from "./IngredientsListItem.js";
import { Row, Col, Accordion, Button, FormControl, InputGroup } from "react-bootstrap";

import styles from "./IngredientsList.module.css";
import axios from "axios";

export default function IngredientsList({ loadIngredientsOptions, updateIngredientsList, ingredientsList }) {
    const { register, handleSubmit } = useForm();

    const [selectedOption, setSelectedOption] = useState(null);
    const [newIngredientErrors, setNewIngredientErrors] = useState({ name: "" })

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
        axios.post("/api/ingredients/new", { name, rating, description })
            .then(res => {
                const newIngredient = res.data;

                updateIngredientsList([
                    ...ingredientsList,
                    newIngredient
                ])

                reset({ name: "", rating: 1, description: ""});
            })
            .catch(error => {
                setNewIngredientErrors(error.response.data);
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
                            <Row className="m-3">
                                <Col>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Name:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            ref={ register }
                                            name="name"
                                            placeholder="Ingredient Name"
                                            isInvalid={ !!newIngredientErrors.name }
                                        />
                                        <FormControl.Feedback type="invalid">
                                            { newIngredientErrors.name }
                                        </FormControl.Feedback>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Rating:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            ref={ register }
                                            name="rating"
                                        >
                                            { [...Array(11).keys()].map(nr => <option key={ "rating-" + nr }>{ nr }</option>) }
                                        </FormControl>
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