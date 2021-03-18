import { Row, Col, Accordion, AccordionCollapse, AccordionToggle, Button, Card } from "react-bootstrap";
import styles from "./ProductListItem.module.css";
import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductListItem({ product, onRemove, onEdit}) {
    const handleEditClick = e => {
        e.stopPropagation();

        onEdit(product.id);
    }

    const handleRemoveClick = e => {
        e.stopPropagation();

        onRemove(product.id);
    }

    return (
        <Accordion>
            <AccordionToggle as={Card.Header} className={ styles["product-list-item-header"] } eventKey={ product.id }>
                <div className={styles["product-list-item-data"]}>
                    <b>{ product.label }</b>
                    <div className={styles["ingredients-list-item-info"]}>
                        <span className="mr-5">Overall Rating: <b>{ product.overallRating }</b></span>
                        <Button className="mr-2" onClick={handleEditClick} size="sm">Edit</Button>
                        <Button onClick={handleRemoveClick} size="sm" variant="danger">Remove</Button>
                    </div>
                </div>
                <FontAwesomeIcon icon={ faAngleDown } />
            </AccordionToggle>
            <AccordionCollapse className="border-bottom" eventKey={ product.id }>
                <Card.Body>
                    <Row>
                        <Col>

                        </Col>
                        <Col>

                        </Col>
                        <Col>

                        </Col>
                    </Row>
                </Card.Body>
            </AccordionCollapse>
        </Accordion>
    )
}