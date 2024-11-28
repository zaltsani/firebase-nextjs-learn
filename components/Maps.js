import { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import useFirebaseData from '@/app/lib/useFirebaseData';
import getUserData from '@/app/lib/getUserData'
import { doc, getDoc } from 'firebase/firestore';
import { firestoredb } from '@/firebase/firebaseConfig';


const Map = ({ locationData }) => {
  
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const [trackingData, setTrackingData] = useState({})
  const [locationDataUse, setLocationDataUse] = useState([])

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

  useEffect(() => {
    if (trackingData && Object.keys(trackingData).length) {
      const coordinates = Object.values(trackingData).map(d => [d._long, d._lat])
      coordinates.push([locationDataUse.long, locationDataUse.lat,])
      // Geo Json
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            },
            properties: {
              name: 'Tracking Path',
              description: 'A sample tracking path'
            }
          }
        ]
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

  return (
    <>
      <div
        id="map"
        className='h-screen w-full'
        // style={{
        //     height: '600px',
        //     width: '1200px'
        // }}
        ref={mapContainerRef}
      />
    </>
  )
};

export default Map;