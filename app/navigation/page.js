'use client'

// import { geometry } from "@turf/turf";
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import polyline from '@mapbox/polyline'
import 'mapbox-gl/dist/mapbox-gl.css'

const Page = () => {
    const [directions, setDirections] = useState(null);
    const mapRef = useRef()
    const mapContainerRef = useRef()

    const fetchDirections = async () => {
        const coordinates = '107.63970204726768,-6.965434056725216;107.606643469816,-6.921728132494621';
        const waypoints = '0;1';
        const waypointNames = 'Start;End';

        try {
            const response = await axios.post(
                'https://api.mapbox.com/directions/v5/mapbox/driving',
                `coordinates=${coordinates}&steps=true&waypoints=${waypoints}&waypoint_names=${waypointNames}&banner_instructions=true`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        geometries: 'geojson',
                        geometry: 'full',
                        // overview: 'full',
                        access_token: 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg'
                    }
                }
            );
            
            setDirections(response.data);
        } catch (error) {
            console.error('Error fetching directions', error);
        }
    };

    useEffect(() => {
        fetchDirections();
    }, []);

    
    useEffect(() => {
        if (directions) {
            const polylineString = directions.routes[0].geometry
            const decodedCoordinates = polyline.decode(polylineString);
    
            console.log(decodedCoordinates.map(d => [d[1], d[0]]))
            const route = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: decodedCoordinates.map(d => [d[1], d[0]])
                        }
                    }
                ]
            };


            mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg'
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: [107.74500819656909, -6.917408695942953],
                zoom: 10,
            });

            mapRef.current.on('load', () => {
                mapRef.current.addSource('navigation', {
                    type: 'geojson',
                    data: route
                });

                mapRef.current.addLayer({
                    id: 'route',
                    source: 'navigation',
                    type: 'line',
                    paint: {
                        'line-width': 3,
                        'line-color': '#007cbf'
                    }
                })
            })
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }

    }, [directions])
    
    return (
        <>
            <div
                ref={mapContainerRef}
                className="w-screen h-screen"
            />
        </>
    )
}

export default Page