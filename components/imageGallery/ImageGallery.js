import React from "react";
import { Carousel } from "react-bootstrap";
import styles from "./ImageGallery.module.css"

export default function ImageGallery({ imageUrls }) {
    const imgs = imageUrls.map(url =>
        <Carousel.Item className={styles["gallery-item"]}>
            <img className={"d-block w-100 " + styles["gallery-img"]} src={url} alt="Failed to load image" />
        </Carousel.Item>
    )

    return (
        <Carousel>
            { imgs }
        </Carousel>
    )
}