import React, {useRef, useState} from "react";
import {GoogleMap, Marker, Polyline, useJsApiLoader} from "@react-google-maps/api";
import {Spinner} from "react-bootstrap";

export default function Map({ locations, setLocations }) {
    const [center, setCenter] = useState({lat: 0, lng: 0});
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC3_D-3T8rx1pzDbpITpZmau9H-3vR1P9w"
    })
    const mapRef = useRef(null);

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

    const options = {
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        draggableCursor: "default"
    }

    const onCenterChanged = () => {
        if (isLoaded && mapRef.current !== null) {
            const newCenter = mapRef.current.state.map.getCenter();
            setCenter(newCenter);
        }
    }

    if (isLoaded) {
        return (
            <div className="border">
                <GoogleMap
                    ref={mapRef}
                    mapContainerStyle={{
                        width: '100%',
                        height: '400px'
                    }}
                    center={center}
                    zoom={2}
                    onCenterChanged={onCenterChanged}
                    onClick={handleClick}
                    options={options}
                >
                    {locations.manufacturingLocation !== null
                        ? <Marker label="Manufacturing" draggable position={locations.manufacturingLocation}/> : ""}
                    {locations.packagingLocation !== null
                        ? <Marker label="Packaging" draggable position={locations.packagingLocation}/> : ""}
                    {locations.packagingLocation !== null
                        ? <Polyline
                            geodesic={true}
                            path={[locations.manufacturingLocation, locations.packagingLocation]}
                            options={{
                                strokeColor: "#007bff"
                            }}

                        /> : ""}
                </GoogleMap>
            </div>
        )
    }

    return <Spinner animation="border" />
}