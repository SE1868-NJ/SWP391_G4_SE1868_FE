import * as React from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";
import { useState } from 'react';
import { useEffect } from 'react';
function MapBox({ addressData }) {
    const [addressMaker, setAddressMaker] = useState([]);
    const [viewState, setViewState] = useState({
        latitude: 21.02883,
        longitude: 105.49343,
        zoom: 10
    });

    useEffect(() => {
        const fetchCoordinates = async () => {
            const newAddressData = await Promise.all(
                Object.values(addressData).map(async (address) => {
                    if (!address) return null;
                    try {
                        const response = await axios.get(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaGlldTMwMDkyMyIsImEiOiJjbTc2Z3E5OGowdG9pMmtwcHc1eHkxNGNmIn0.x5yQ1KzUobIw39-ORGEFBg`
                        );

                        if (response.status === 200 && response.data.features.length > 0) {
                            return {
                                longitude: response.data.features[0].center[0],
                                latitude: response.data.features[0].center[1],
                            };
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy tọa độ:", error);
                    }
                    return null;
                })
            );

            const filteredData = newAddressData.filter(Boolean);
            setAddressMaker(filteredData);

            // Cập nhật vị trí bản đồ đến tọa độ đầu tiên nếu có dữ liệu
            if (filteredData.length > 0) {
                setViewState({
                    latitude: filteredData[0].latitude,
                    longitude: filteredData[0].longitude,
                    zoom: 12
                });
            }
        };

        fetchCoordinates();
    }, [addressData]);

    return (
        <Map
            mapboxAccessToken="pk.eyJ1IjoiaGlldTMwMDkyMyIsImEiOiJjbTc2Z3E5OGowdG9pMmtwcHc1eHkxNGNmIn0.x5yQ1KzUobIw39-ORGEFBg"
            style={{ width: '100%', height: '500px' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
        >
            {addressMaker.map((address, index) => (
                <Marker key={index} longitude={address.longitude} latitude={address.latitude} anchor="bottom">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24" height="24">
                        <path fill="#ff0000" d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/>
                    </svg>
                </Marker>
            ))}
        </Map>
    );
}

export default MapBox;