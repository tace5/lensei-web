import React, {useRef, useState} from "react";
import {GoogleMap, Marker, Polyline, useJsApiLoader} from "@react-google-maps/api";
import {FormControl, Spinner} from "react-bootstrap";

export default function Map({ locations, setLocations, errors }) {
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

        if (locations.manufacturingLoc === null || locations.packagingLoc !== null) {
            setLocations({
                manufacturingLoc: location,
                packagingLoc: null
            })
        } else {
            setLocations({
                ...locations,
                packagingLoc: location
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

    const borderDanger = errors.manufacturingLoc || errors.packagingLoc ? "border-danger" : "";

    if (isLoaded) {
        return (
            <div>
                <div className={`border ${borderDanger}`}>
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
                        {locations.manufacturingLoc !== null
                            ? <Marker label="Manufacturing" draggable position={locations.manufacturingLoc}/> : ""}
                        {locations.packagingLoc !== null
                            ? <Marker label="Packaging" draggable position={locations.packagingLoc}/> : ""}
                        {locations.packagingLoc !== null
                            ? <Polyline
                                geodesic={true}
                                path={[locations.manufacturingLoc, locations.packagingLoc]}
                                options={{
                                    strokeColor: "#007bff"
                                }}

                            /> : ""}
                    </GoogleMap>
                </div>
                { errors.manufacturingLoc && <FormControl.Feedback style={{ display: "block" }} type="invalid">{ errors.manufacturingLoc.message }</FormControl.Feedback> }
                { errors.packagingLoc && <FormControl.Feedback style={{ display: "block" }} type="invalid">{ errors.packagingLoc.message }</FormControl.Feedback> }
            </div>
        )
    }

    return <Spinner animation="border" />
}