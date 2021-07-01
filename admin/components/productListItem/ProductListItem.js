import {Button, Card} from "react-bootstrap";
import styles from "./ProductListItem.module.scss";
import React from "react";
import {faAngleDown, faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <Card className={ styles["product-list-item-header"] } eventKey={ product.id }>
            <Card.Header className={styles["product-list-item-data"]}>
                <div>
                    <b>{ product.name }</b>
                    <span className="ms-4">{ product.format + "-" + product.code }</span>
                    <b className="ms-4 color-poor">{ !product.isRated ? "UNRATED" : "" }</b>
                </div>
                <div className={styles["ingredients-list-item-info"]}>
                    <span className="me-4 d-flex align-items-center">
                        <div className="text-center">Added { daysSinceCreation === 0 ? "Today" : daysSinceCreation + " Days Ago" }</div>
                    </span>
                    <Button style={{ }} className={"me-3 bg-transparent border-0 " + styles["btn-edit"]} onClick={onViewClick}><FontAwesomeIcon size="lg" icon={ faEdit } /></Button>
                    <Button style={{width: 40, color: "#dc3545" }} className={"bg-transparent border-0 " + styles["btn-remove"]} onClick={onDeleteClick} variant="danger"><FontAwesomeIcon size="lg" icon={faTrashAlt} /></Button>
                </div>
            </Card.Header>
        </Card>
    )
}