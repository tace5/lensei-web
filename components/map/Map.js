import React, { useState } from "react";
import {GoogleMap, useJsApiLoader, Marker} from "@react-google-maps/api";
import {Spinner} from "react-bootstrap";

export default function Map({ locations, setLocations }) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC3_D-3T8rx1pzDbpITpZmau9H-3vR1P9w"
    })

    const handleClick = ({ latLng }) => {
        const location = {
            lat: latLng.lat(),
            lng: latLng.lng()
        }

        if (locations.manufacturingLocation === null || locations.packagingLocation !== null) {
            setLocations({
                manufacturingLocation: location,
                packagingLocation: null
            })
        } else {
            setLocations({
                ...locations,
                packagingLocation: location
            })
        }
    }

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }

    const controls = {
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    }

    return isLoaded ? <GoogleMap
                mapContainerStyle={{
                    width: '100%',
                    height: '400px'
                }}
                center={{
                    lat: 0,
                    lng: 0
                }}
                zoom={2}
                onClick={handleClick}
                options={controls}
            >
                { /* Child components, such as markers, info windows, etc. */ }
                { locations.manufacturingLocation !== null
                    ? <Marker label="Manufacturing" draggable position={locations.manufacturingLocation} /> : "" }
                { locations.packagingLocation !== null
                    ? <Marker label="Packaging" draggable position={locations.packagingLocation} /> : "" }
            </GoogleMap>
        : <Spinner animation="border" />;
}