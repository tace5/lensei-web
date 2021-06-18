import React, {useState} from "react";
import Layout from "../components/layout/Layout.js";
import * as styles from "../styles/pages/Home.module.scss";
import Search from "../components/search/Search.js";
import ShopMap from "../components/map/ShopMap.js";

export default function Home() {
    const [searchValue, setSearchValue] = useState("");

    const onSearch = e => {
        e.preventDefault();

        console.log(searchValue);
    }

    return (
        <Layout title="Home">
            <div className={styles["main-section"] + " " + styles["section"]}>
                <div className="row">
                    <h2>Empowering sustainable <span className={styles["green-underline"]}>shoppers.</span></h2>
                    <div className={"col " + styles["main-section-left"]}>
                        <p className={"mt-4 mb-1 " + styles["sub-heading"]}>Squirrel is a mobile app to scan grocery items while shopping.</p>
                        <a>Learn More</a>

                        <div className="my-5" >
                            <Search onSearch={onSearch} onChange={e => setSearchValue(e.target.value)} value={searchValue} placeholder="Look for your nearest shop" />
                        </div>

                        <div className="d-flex align-items-center">
                            <a className={styles["playstore-badge"]}><img src="/playstore-badge.png" /></a>
                            <a className={"ms-3 " + styles["appstore-badge"]}><img src="/appstore-badge.svg" /></a>
                        </div>
                    </div>
                    <img className={"col " + styles["landing-page-graphic"]} src="/landing-page-graphic.png" />
                </div>
            </div>
            <div className={styles["section"]}>
                <h4>Find your shop</h4>
                <p>Search where you can shop with Squirrel.</p>
                <div className="mt-5" >
                    <ShopMap onSearch={onSearch} onSearchTextChange={e => setSearchValue(e.target.value)} searchValue={searchValue} />
                </div>
            </div>
        </Layout>
    )
}
