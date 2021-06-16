import {Row, Col, Accordion, AccordionCollapse, AccordionToggle, Button, Card, Modal} from "react-bootstrap";
import styles from "./ProductListItem.module.scss";
import React from "react";
import {faAngleDown, faEdit, faThumbsDown, faThumbsUp, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calcRatingColor } from "../../../main/helpers/rating.js";

export default function ProductListItem({ product, onDelete, onView }) {
    const onViewClick = e => {
        e.stopPropagation();
        onView(product.id);
    }

    const onDeleteClick = e => {
        e.stopPropagation();
        onDelete(product.id);
    }

    const daysSinceCreation = new Date().getDate() - new Date(product.dateCreated).getDate();

    return (
        <Accordion>
            <AccordionToggle as={Card.Header} className={ styles["product-list-item-header"] } eventKey={ product.id }>
                <div className={styles["product-list-item-data"]}>
                    <b>{ product.label }</b>
                    <div className={styles["ingredients-list-item-info"]}>
                        <span className="me-4 d-flex align-items-center">
                            Rating:
                            <div
                                className={calcRatingColor(product.overallRating) + " ms-2 border " + " " + styles["overall-rating"]}
                            >{ product.overallRating }</div>
                        </span>
                        <Button style={{ }} className={"me-3 bg-transparent border-0 " + styles["btn-edit"]} onClick={onViewClick}><FontAwesomeIcon size="lg" icon={ faEdit } /></Button>
                        <Button style={{width: 40, color: "#dc3545" }} className={"bg-transparent border-0 " + styles["btn-remove"]} onClick={onDeleteClick} variant="danger"><FontAwesomeIcon size="lg" icon={faTrashAlt} /></Button>
                    </div>
                </div>
                <FontAwesomeIcon icon={ faAngleDown } />
            </AccordionToggle>
            <AccordionCollapse className="border-bottom" eventKey={ product.id }>
                <Card.Body className={"p-4"}>
                    <Row className="mb-5 mt-3 d-flex justify-content-around">
                        <Col className={calcRatingColor(product.companyRating) + " text-center border " + styles["product-rating"]}>
                            <b>Company</b> <br /> <b style={{fontSize: "52px"}}>{ product.companyRating }</b>
                        </Col>
                        <Col className={calcRatingColor(product.ingredientsRating) + " text-center border " + styles["product-rating"]}>
                            Ingredients <br /><b style={{fontSize: "52px"}}>{ product.ingredientsRating }</b>
                        </Col>
                        <Col className={calcRatingColor(product.packagingRating) + " text-center border " + styles["product-rating"]}>
                            Packaging <br /><b style={{fontSize: "52px"}}>{ product.packagingRating }</b>
                        </Col>
                    </Row>
                    <Row style={{fontSize: "24px"}}>
                        <Col>Price: <b>£{ product.price }</b></Col>
                        <Col>
                            <div style={{float: "right"}}>
                                <span className={"font-weight-bold me-3 " + styles["likes"]}>{ product.likes }</span>
                                <FontAwesomeIcon
                                    className={"me-4 " + styles["likes-icon"]}
                                    size="1x"
                                    icon={faThumbsUp}
                                    flip="horizontal" />
                                <FontAwesomeIcon
                                    className={styles["dislikes-icon"]}
                                    size="1x"
                                    icon={faThumbsDown}
                                />
                                <span className={"font-weight-bold ms-3 " + styles["dislikes"]}>{ product.dislikes }</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="text-center" style={{color: "lightgray"}}>Added { daysSinceCreation === 0 ? "Today" : daysSinceCreation + " Days Ago" }</div>
                        </Col>
                    </Row>
                </Card.Body>
            </AccordionCollapse>
        </Accordion>
    )
}