import { Row, Col, Accordion, AccordionCollapse, AccordionToggle, Button, Card } from "react-bootstrap";
import styles from "./ProductListItem.module.css";
import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductListItem({ product, onRemove, onView}) {
    const handleViewClick = e => {
        e.stopPropagation();

        onView(product.id);
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
                        <Button className="mr-2" onClick={handleViewClick} size="sm">View</Button>
                        <Button onClick={handleRemoveClick} size="sm" variant="danger">Remove</Button>
                    </div>
                </div>
                <FontAwesomeIcon icon={ faAngleDown } />
            </AccordionToggle>
            <AccordionCollapse className="border-bottom" eventKey={ product.id }>
                <Card.Body>
                    <Row className="mb-3">
                        <Col className="text-center">Company Rating: <b>{ product.companyRating }</b></Col>
                        <Col className="text-center">Ingredients Rating: <b>{ product.ingredientsRating }</b></Col>
                        <Col className="text-center">Packaging Rating: <b>{ product.packagingRating }</b></Col>
                    </Row>
                    <Row>
                        <Col className="text-center">Price: <b>£{ product.price }</b></Col>
                        <Col className="text-center"><span className="mr-2">Likes: <b>{product.likes}</b></span> Dislikes: <b>{product.dislikes}</b></Col>
                        <Col className="text-center">Added <b>{ new Date().getDate() - new Date(product.dateCreated).getDate() }</b> Days Ago</Col>
                    </Row>
                </Card.Body>
            </AccordionCollapse>
        </Accordion>
    )
}