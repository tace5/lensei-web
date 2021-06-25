import React, {useState} from "react";
import Layout from "../components/layout/Layout.js";
import * as styles from "../styles/pages/Home.module.scss";
import Search from "../components/search/Search.js";
import ShopMap from "../components/map/ShopMap.js";
import { Col, Row, Carousel } from "react-bootstrap";

export default function Home() {
    const [searchValue, setSearchValue] = useState("");

    const onSearch = e => {
        e.preventDefault();

        console.log(searchValue);
    }

    return (
        <Layout title="Home">
            <div>
                <Row className="me-0 section section-content">
                    <h2>Empowering sustainable <span className={styles["green-underline"]}>shoppers.</span></h2>
                    <Col className={styles["main-section-left"]}>
                        <p className={"mt-4 mb-1 " + styles["sub-heading"]}>Squirrel is a mobile app to scan grocery items while shopping.</p>
                        <a className="text-decoration-underline">Learn More</a>

                        <div className="my-5" >
                            <Search onSearch={onSearch} onChange={e => setSearchValue(e.target.value)} value={searchValue} placeholder="Look for your nearest shop" />
                        </div>

                        <div className="d-flex align-items-center">
                            <a className={styles["playstore-badge"]}><img src="/img/playstore-badge.png" /></a>
                            <a className={"ms-3 " + styles["appstore-badge"]}><img src="/img/appstore-badge.svg" /></a>
                        </div>
                    </Col>
                    <Col className={"pt-5 ms-5 " + styles["main-section-right"]}>
                        <div className={styles["landing-page-phone"]}>
                            <div className={styles["landing-page-phone-screen"]}>
                                <Carousel controls={false}>
                                    <Carousel.Item>
                                        Item 1
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        Item 2
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        Item 3
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        Item 4
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className="me-0">
                <div className="section-content">
                    <h4>Find your shop</h4>
                    <p>Search where you can shop with Squirrel.</p>
                    <div className="mt-5" >
                        <ShopMap onSearch={onSearch} onSearchTextChange={e => setSearchValue(e.target.value)} searchValue={searchValue} />
                    </div>
                </div>
            </Row>
        </Layout>
    )
}
