import React from "react";
import { Card, AccordionToggle, AccordionCollapse, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDown, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { calcRatingColor } from "../../helpers/colors.js";

import styles from "./IngredientsListItem.module.css";

export default function IngredientsListItem({ ingredient, onRemove }) {
    const handleRemoveClick = (e) => {
        e.stopPropagation();

        onRemove(ingredient.id);
    }

    return (
        <Card>
            <AccordionToggle as={Card.Header} className={ styles["ingredients-list-item-header"] } eventKey={ ingredient.id }>
                <div className={styles["ingredients-list-item-data"]}>
                    <b>{ ingredient.label }</b>
                    <div className={styles["ingredients-list-item-info"]}>
                        <span className="mr-3 d-flex align-items-center">Rating:
                            <div
                                className={"ml-2 border " + styles["ingredient-rating"]}
                                style={{backgroundColor: calcRatingColor(ingredient.rating)}}
                            >{ ingredient.rating }</div>
                        </span>
                        <Button style={{width: 40, color: "#dc3545" }} className="mr-3 bg-transparent border-0" onClick={handleRemoveClick} size="lg" variant="danger"><FontAwesomeIcon icon={faTrashAlt} /></Button>
                    </div>
                </div>
                <FontAwesomeIcon icon={ faAngleDown } />
            </AccordionToggle>
            <AccordionCollapse eventKey={ ingredient.id }>
                <Card.Body>{ ingredient.description }</Card.Body>
            </AccordionCollapse>
        </Card>
    )
}