'use client'

import { database, firestoredb } from "@/firebase/firebaseConfig"
import { onValue, ref } from "firebase/database"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as turf from '@turf/turf'

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'


const Page = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()

    const [locationData, setLocationData] = useState(null)
    const [loadingLocationData, setLoadingLocationData] = useState(true)

    const [trackingData, setTrackingData] = useState(null)
    const [locationDataUse, setLocationDataUse] = useState(null)

    const pointRef = useRef(null);
    const originRef = useRef(null);
    const routeRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const steps = 500;
    let counter = 0;

    useEffect(() => {
        // get data from realtime database
        const dbRef = ref(database, '/')
        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setLocationData(data)
            }
        })
        setLoadingLocationData(false)

        // get tracking data
        const docRef = doc(firestoredb, `tracking/001`)
        const fetchTrackData = async () => {
            const docSnap = await getDoc(docRef)
            const data = docSnap.data().track
            setTrackingData(data)
        }
        fetchTrackData()
    }, [])

    
    useEffect(() => {
        if (locationData && trackingData) {
            const track = Object.values(trackingData).map(d => [d._long, d._lat])

            const startBearing = 0
            const pitch = 20
            const altitude = 2000

            const route = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: track
                        }
                    }
                ]
            };
            routeRef.current = route;

            const point = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: track[0]
                        }
                    }
                ]
            };
            pointRef.current = point;

            const transpeninsularLine = {
                type: "Feature",
                properties: {
                    stroke: "#555555",
                    "stroke-width": 2,
                    "stroke-opacity": 1
                },
                geometry: {
                    type: "LineString",
                    coordinates: track
                }
            };
            console.log(transpeninsularLine)

            mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg'
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: track[0],
                zoom: 7,
                pitch: 20,
            });

            mapRef.current.flyTo({
                center: [107.74500819656909, -6.917408695942953],
                zoom: 17,
            })

            if (track) {
                console.log(track)
                // const marker = new mapboxgl.Marker({ color: 'red', rotation: 0 })
                //     .setLngLat([track[0][1], track[0][0]])
                //     .addTo(mapRef.current)
            }

            mapRef.current.on('load', () => {
                // Add Source
                mapRef.current.addSource('route', {
                    type: 'geojson',
                    data: route
                });

                mapRef.current.addSource('point', {
                    type: 'geojson',
                    data: point
                });

                mapRef.current.addSource('tp-line', {
                    type: 'geojson',
                    data: transpeninsularLine,
                    lineMetrics: true
                })

                // Add Layer
                mapRef.current.addLayer({
                    id: 'route',
                    source: 'route',
                    type: 'line',
                    paint: {
                        'line-width': 7,
                        'line-color': '#007cbf'
                    }
                });

                mapRef.current.addLayer({
                    id: 'point',
                    source: 'point',
                    type: 'symbol',
                    layout: {
                        'icon-image': 'airport',
                        'icon-size': 1.5,
                        'icon-rotate': ['get', 'bearing'],
                        'icon-rotation-alignment': 'map',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true
                    }
                });

                mapRef.current.addLayer({
                    id: "tp-line-line",
                    type: "line",
                    source: 'tp-line',
                    paint: {
                        "line-color": "rgba(0,0,0,0)",
                        "line-width": 8,
                        "line-opacity": 0.7
                    }
                })


                // Calculate Distance Track
                let totalDistance = 0
                for (let i = 0; i < track.length - 1; i++) {
                    totalDistance += turf.distance(track[i], track[i+1])
                }

                const lines = turf.lineString(track)

                // Camera
                const camera = mapRef.current.getFreeCameraOptions()

                const computeCameraPosition = (
                    pitch,
                    bearing,
                    targetPosition,
                    altitude,
                    smooth = false
                ) => {
                    var bearingInRadian = bearing / 57.29;
                    var pitchInRadian = (90 - pitch) / 57.29;
                    
                    var lngDiff =
                    ((altitude / Math.tan(pitchInRadian)) * Math.sin(-bearingInRadian)) / 70000; // ~70km/degree longitude
                    var latDiff = ((altitude / Math.tan(pitchInRadian)) * Math.cos(-bearingInRadian)) / 110000 // 110km/degree latitude
                    
                    var correctedLng = targetPosition.lng + lngDiff;
                    var correctedLat = targetPosition.lat - latDiff;
                    
                    const newCameraPosition = {
                        lng: correctedLng,
                        lat: correctedLat
                    };
                    
                    return newCameraPosition
                }

                // Transition Camera from Default
                const startCameraPosition = computeCameraPosition(
                    pitch,
                    startBearing,
                    {lng: lines.geometry.coordinates[0][1], lat: lines.geometry.coordinates[0][0]},
                    altitude,
                    true
                )
                mapRef.current.easeTo({
                    center: track[0],
                    pitch: pitch,
                    bearing: startBearing,
                    duration: 3000,
                })

                let startTime;
                const duration = 5000

                // animate along path
                const frame = (time) => {
                    console.log(time)
                    if (!startTime) startTime = time;
                    const animationPhase = (time - startTime) / duration
                    const animationPhaseDisplay = animationPhase.toFixed(2)

                    const [lng, ltd] = turf.along(lines, totalDistance * animationPhase).geometry.coordinates

                    const bearing = startBearing - animationPhase * 20

                    const CameraPosition = computeCameraPosition(
                        pitch,
                        bearing,
                        {lng: lng, lat: ltd},
                        altitude,
                        true
                    )

                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(CameraPosition, altitude);
                    camera.lookAtPoint([lng, ltd]);
                    // Apply camera changes
                    mapRef.current.setFreeCameraOptions(camera);
                    
                    mapRef.current.setPaintProperty("tp-line-line", "line-gradient", [
                        "step",
                        ["line-progress"],
                        "yellow",
                        animationPhase,
                        "rgba(0, 0, 0, 0)"
                    ]);



                    // End animation
                    if (animationPhase > 1) {
                        return;
                    }
                    window.requestAnimationFrame(frame);
                }

                window.requestAnimationFrame(frame)

                // repeat
                // setInterval(() => {
                //     startTime = undefined
                //     window.requestAnimationFrame(frame)
                // }, duration)

            })

            
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [trackingData, locationData])

    return (
        <>
            <div
                className="maps w-screen h-screen"
                ref={mapContainerRef}
            />
        </>
    )
}

export default Page