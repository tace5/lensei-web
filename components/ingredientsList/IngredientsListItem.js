import React from "react";
import { Card, AccordionToggle, AccordionCollapse, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import styles from "./IngredientsListItem.module.css";

export default function IngredientsListItem({ ingredient }) {
    return (
        <Card>
            <AccordionToggle className={ styles["toggle-ingredient-btn"] } eventKey={ ingredient.id }>
                <Card.Header className={ styles["ingredients-list-item-header"] }>
                    <div>
                        <b>{ ingredient.label }</b>
                    </div>
                    <div>
                        { ingredient.rating }
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