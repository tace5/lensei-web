import React, {useRef, useState} from "react";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import {FormControl, Spinner} from "react-bootstrap";

export default function Map({ location, setLocation, error, clearErrors }) {
    const [center, setCenter] = useState({lat:0, lng:0});

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC3_D-3T8rx1pzDbpITpZmau9H-3vR1P9w"
    })
    const mapRef = useRef(null);

    const handleClick = ({ latLng }) => {
        clearErrors();

        const newLocation = {
            lat: latLng.lat(),
            lng: latLng.lng()
        }

        setLocation(newLocation);
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

    const borderDanger = error ? "border-danger" : "";

    const onCenterChanged = () => {
        if (isLoaded && mapRef.current !== null) {
            const newCenter = mapRef.current.state.map.getCenter();
            setCenter(newCenter);
        }
    }

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
                        {location.lat !== null && location.lng !== null
                            ? <Marker label="Production" draggable position={location}/> : ""}
                    </GoogleMap>
                </div>
                { error && <FormControl.Feedback style={{ display: "block" }} type="invalid">{ error.message }</FormControl.Feedback> }
            </div>
        )
    }

    return <Spinner animation="border" />
}