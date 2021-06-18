import React from "react";
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";
import {Spinner} from "react-bootstrap";

import * as styles from "./ShopMap.module.scss";
import Search from "../search/Search.js";

export default function ShopMap({ onSearch, onSearchTextChange, searchValue}) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC3_D-3T8rx1pzDbpITpZmau9H-3vR1P9w"
    })

    const options = {
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        draggableCursor: "default"
    }

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }

    if (isLoaded) {
        return (
            <div className={styles.shopmap}>
                <div className={styles["search-container"]}>
                    <Search onSearch={onSearch} onChange={e => onSearchTextChange(e.target.value)} value={searchValue} placeholder="Enter an address or postcode" />
                </div>
                <div className={styles["map-container"]}>
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%',
                            height: '400px'
                        }}
                        zoom={2}
                        center={{
                            lat: 0,
                            lng: 0
                        }}
                        options={options}
                    />
                </div>
            </div>
        )
    }

    return <Spinner animation="border" />
}