import {Row, Col, Accordion, AccordionCollapse, AccordionToggle, Button, Card, Modal} from "react-bootstrap";
import styles from "./ProductListItem.module.scss";
import React from "react";
import {faAngleDown, faEdit, faThumbsDown, faThumbsUp, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calcRatingColor } from "../../helpers/rating.js";

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
                        <span className="mr-4 d-flex align-items-center">
                            Rating:
                            <div
                                className={"ml-2 border " + styles["overall-rating"]}
                                style={{backgroundColor: calcRatingColor(product.overallRating)}}
                            >{ product.overallRating }</div>
                        </span>
                        <Button style={{width: 40, color: "#007bff" }} className="mr-3 bg-transparent border-0" onClick={onViewClick}><FontAwesomeIcon size="lg" icon={ faEdit } /></Button>
                        <Button style={{width: 40, color: "#dc3545" }} className="bg-transparent border-0" onClick={onDeleteClick} variant="danger"><FontAwesomeIcon size="lg" icon={faTrashAlt} /></Button>
                    </div>
                </div>
                <FontAwesomeIcon icon={ faAngleDown } />
            </AccordionToggle>
            <AccordionCollapse className="border-bottom" eventKey={ product.id }>
                <Card.Body className={"p-4"}>
                    <Row className="mb-5 mt-3 d-flex justify-content-around">
                        <Col style={{backgroundColor: calcRatingColor(product.companyRating)}} className={"text-center border " + styles["product-rating"]}>
                            <b>Company</b> <br /> <b style={{fontSize: "52px"}}>{ product.companyRating }</b>
                        </Col>
                        <Col style={{backgroundColor: calcRatingColor(product.ingredientsRating)}} className={"text-center border " + styles["product-rating"]}>
                            Ingredients <br /><b style={{fontSize: "52px"}}>{ product.ingredientsRating }</b>
                        </Col>
                        <Col style={{backgroundColor: calcRatingColor(product.packagingRating)}} className={"text-center border " + styles["product-rating"]}>
                            Packaging <br /><b style={{fontSize: "52px"}}>{ product.packagingRating }</b>
                        </Col>
                    </Row>
                    <Row style={{fontSize: "24px"}}>
                        <Col>Price: <b>£{ product.price }</b></Col>
                        <Col>
                            <div style={{float: "right"}}>
                                <span className="font-weight-bold mr-3" style={{color: "green", fontSize: "18px"}}>{ product.likes }</span>
                                <FontAwesomeIcon
                                    className="mr-4"
                                    style={{color: "green"}}
                                    size="1x"
                                    icon={faThumbsUp}
                                    flip="horizontal" />
                                <FontAwesomeIcon
                                    style={{color: "red"}}
                                    size="1x"
                                    icon={faThumbsDown}
                                />
                                <span className="font-weight-bold ml-3" style={{color: "red", fontSize: "18px"}}>{ product.dislikes }</span>
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