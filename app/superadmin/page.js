'use client'

import { database, firestoredb } from "@/firebase/firebaseConfig"
import { onValue, ref } from "firebase/database"
import { useEffect, useRef, useState } from "react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { doc, getDoc } from "firebase/firestore"
import { Button } from "../ui/button"
import * as turf from '@turf/turf'


const Page = () => {
    const [locationData, setLocationData] = useState(null)
    const [loadingLocationData, setLoadingLocationData] = useState(true)
    const [trackingData, setTrackingData] = useState(null)
    const [locationDataUse, setLocationDataUse] = useState(null)
    const [devicesList, setDevicesList] = useState(null)
    const [activeDevice, setActiveDevice] = useState(null)

    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null); // To store the recorded video blob
    const [videoUrl, setVideoUrl] = useState(null); // To store the video URL
    const [mediaRecorder, setMediaRecorder] = useState(null);


    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        const dbRef = ref(database, '/')
        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setLocationData(data)
                const listDevices = Object.keys(data)
                setDevicesList(listDevices)
            }
        })
        setLoadingLocationData(false)
    }, [])

    // Initial Map
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg'
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [107.746053, -6.916904],
            zoom: 10.12,
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [locationData])

    // Add Marker
    useEffect(() => {
        const markers = [];
    
        for (const key in locationData) {
            const data = locationData[key]
            
            const marker = new mapboxgl.Marker({ color: 'blue', rotation: 0 })
                .setLngLat([data.long, data.lat])
                .addTo(mapRef.current)
        
            marker.getElement().addEventListener('click', () => {
                const deviceId = key
                setLocationDataUse(data)
                const docRef = doc(firestoredb, `tracking/${deviceId}`)
                const fetchTrackData = async () => {
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data().track
                    setTrackingData(data)
                }
                fetchTrackData()
            })
            markers.push(marker);
        }
        
        return () => {
            markers.forEach((marker) => marker.remove());
        }
    }, [locationData, trackingData])

    // Add Track Path
    useEffect(() => {
        if (trackingData && Object.keys(trackingData).length) {
            const coordinates = Object.values(trackingData).map(d => [d._long, d._lat])
            coordinates.push([locationDataUse.long, locationDataUse.lat,])

            // Geo Json
            const geojson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    },
                    properties: {
                        name: 'Tracking Path',
                        description: 'A sample tracking path'
                    }
                }]
            }
        
            // Add the polyline (track) to the map
            if (mapRef.current.isStyleLoaded()) {
                if (mapRef.current.getSource('trackingPath')) {
                    mapRef.current.getSource('trackingPath').setData(geojson);
                } else {
                    mapRef.current.addSource('trackingPath', {
                        type: 'geojson',
                        data: geojson,
                    });
            
                    mapRef.current.addLayer({
                        id: 'trackingPathLayer',
                        type: 'line',
                        source: 'trackingPath',
                        paint: {
                            'line-color': '#FF5733',
                            'line-width': 4,
                        },
                    });
                }
            }
        }
        
    }, [trackingData])

    function handleDeviceClick(deviceName) {
        const data = locationData[deviceName]
        mapRef.current.easeTo({
            center: [data.long, data.lat],
            zoom: 15
        })
        setLocationDataUse(data)
        const docRef = doc(firestoredb, `tracking/${deviceName}`)
        const fetchTrackData = async () => {
            const docSnap = await getDoc(docRef)
            const data = docSnap.data().track
            setTrackingData(data)
        }
        fetchTrackData()
        setActiveDevice(deviceName)
    }

    function playVideo() {
        mapRef.current.flyTo({
            center: [trackingData[0]['_long'], trackingData[0]['_lat']],
            zoom: 12,
            // duration: 2000
        })

        mapRef.current.once("moveend", () => {        

        const track = Object.values(trackingData).map(d => [d._long, d._lat])
        const linesPath = turf.lineString(track)
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

        let totalDistance = 0
        for (let i = 0; i < track.length - 1; i++) {
            totalDistance += turf.distance(track[i], track[i+1])
        }

        let startTime;
        const duration = 3000;

        // Remove existing layer and source if they exist
        if (mapRef.current.getLayer("tp-line-line")) mapRef.current.removeLayer("tp-line-line");
        if (mapRef.current.getSource("tp-line")) mapRef.current.removeSource("tp-line");
        
        mapRef.current.addSource('tp-line', {
            type: 'geojson',
            data: transpeninsularLine,
            lineMetrics: true
        })
    
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

        const frame = (time) => {
            if (!startTime) startTime = time

            const animationPhase = (time - startTime) / duration
            const [lng, ltd] = turf.along(linesPath, totalDistance * animationPhase).geometry.coordinates
            console.log("time", time, "animation phase", animationPhase, "lng, ltd", lng, ltd)

            mapRef.current.setPaintProperty("tp-line-line", "line-gradient", [
                "step",
                ["line-progress"],
                "yellow",
                animationPhase,
                "rgba(0, 0, 0, 0)"
            ])

            mapRef.current.jumpTo({
                center: [lng, ltd],
                zoom: 12,
                // bearing: 20,
                // pitch: 20
            })

            // End Animation
            if (animationPhase > 1) {
                return
            }

            window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
        })
    }

    const handleRecord = () => {
        if (!isRecording) {
            setIsRecording(true)
            const canvas = mapRef.current.getCanvas()
            const stream = canvas.captureStream()
            const recorder = new MediaRecorder(stream)

            recorder.ondataavailable = (event) => {
                setVideoBlob(event.data)
            }

            recorder.onstop = () => {
                const url = URL.createObjectURL(videoBlob)
                setVideoUrl(url)
            }

            recorder.start()
            setMediaRecorder(recorder)
            
        } else {
            setIsRecording(false)
            mediaRecorder.stop()
            console.log("blob", videoBlob)
            console.log("url", videoUrl)
        }
    }

    return (
        <div className="relative w-full h-full">
            <div
                ref={mapContainerRef}
                className="w-full h-full"
            />
            <div className="absolute h-full top-0 left-0 bg-white rounded-r-lg pl-7 p-10" >
                <p className="font-bold mb-2">Device List</p>
                <ul className="gap-y-10">
                    {devicesList && (
                        devicesList.map(device => (
                            <li
                                key={device}
                                onClick={() => handleDeviceClick(device)}
                                className="cursor-pointer hover:bg-blue-300 rounded-lg px-2 py-1"
                            >
                                {device}
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <Button
                className="absolute bottom-5 right-2"
                onClick={() => playVideo()}
            >Play Video</Button>
            <Button
                className="absolute bottom-20 right-2"
                onClick={handleRecord}
            >{isRecording ? 'Stop Recording' : 'Start Recording'}</Button>
            
            {videoUrl && (
                <video controls width="640" height="360" src={videoUrl} />
            )}
        </div>
    )
}

export default Page