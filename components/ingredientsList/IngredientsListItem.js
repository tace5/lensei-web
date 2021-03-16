import React from "react";
import { Card, AccordionToggle, AccordionCollapse, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import styles from "./IngredientsListItem.module.css";

export default function IngredientsListItem({ ingredient, onRemove }) {
    const handleRemoveClick = (e) => {
        e.stopPropagation();

        onRemove(ingredient.id);
    }

    return (
        <Card>
            <AccordionToggle className={ styles["toggle-ingredient-btn"] } eventKey={ ingredient.id }>
                <Card.Header className={ styles["ingredients-list-item-header"] }>
                    <div className={styles["ingredients-list-item-data"]}>
                        <b>{ ingredient.label }</b>
                        <div className={styles["ingredients-list-item-info"]}>
                            <span className="mr-5">Rating: <b>{ ingredient.rating }</b></span>
                            <Button onClick={handleRemoveClick} size="sm" variant="danger">Remove</Button>
                        </div>
                    </div>
                    <FontAwesomeIcon icon={ faAngleDown } />
                </Card.Header>
            </AccordionToggle>
            <AccordionCollapse eventKey={ ingredient.id }>
                <Card.Body>{ ingredient.description }</Card.Body>
            </AccordionCollapse>
        </Card>
    )
}