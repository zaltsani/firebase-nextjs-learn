import { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import useFirebaseData from '@/app/lib/useFirebaseData';
import getUserData from '@/app/lib/getUserData'


const Map = ({ locationData }) => {
  // const userId = user?.uid
  // const [userDetails, setUserDetails] = useState(null)
  // const [userRole, setUserRole] = useState(null)
  // const [loadingUserDetails, setLoadingUserDetails] = useState(true)

  // useEffect(() => {
  //   const fetchUserRole = async (userId) => {
  //     try {
  //       const fetchedRole = await getUserData(userId);
  //       setUserDetails(fetchedRole);
  //       setUserRole(fetchedRole.role)
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoadingUserDetails(false)
  //     }
  //   }
  //   fetchUserRole(userId)
  // }, [userId])

  // const [locationData, setLocationData] = useState([])

  
  
  // const { data, loading } = useFirebaseData('/')
  // console.log(user?.email)


  // From Here

  const mapRef = useRef()
  const mapContainerRef = useRef()
  console.log(locationData)

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [107.746053, -6.916904],
      zoom: 10.12,
    });


    for (const key in locationData) {
      const data = locationData[key]
      // console.log()
      
      new mapboxgl.Marker({ color: 'blue', rotation: 0 })
        .setLngLat([data.long, data.lat])
        .addTo(mapRef.current)
    }


    // To Here



    // new mapboxgl.Marker()
    //   .setLngLat([coord[1], coord[0]])
    //   .addTo(mapRef.current);
    // console.log(data['001'])
    

    // new mapboxgl.Marker({ color: 'blue', rotation: 0 })
    //   .setLngLat([coord[1], coord[0]])
    //   .addTo(mapRef.current);

      // const geojson = {
      //   type: 'FeatureCollection',
      //   features: [
      //     {
      //       type: 'Feature',
      //       geometry: {
      //         type: 'LineString',
      //         coordinates: trackArray // Use the data array directly here
      //       },
      //       properties: {
      //         name: 'Tracking Path',
      //         description: 'A sample tracking path'
      //       }
      //     }
      //   ]
      // };
  
      // // Add the polyline (track) to the map
      // mapRef.current.on('load', () => {
      //   mapRef.current.addSource('trackingPath', {
      //     type: 'geojson',
      //     data: geojson
      //   });
  
      //   mapRef.current.addLayer({
      //     id: 'trackingPathLayer',
      //     type: 'line',
      //     source: 'trackingPath',
      //     paint: {
      //       'line-color': '#FF5733', // Line color
      //       'line-width': 4 // Line width
      //     }
      //   });
      // });



    return () => {
      mapRef.current.remove()
    }
  }, [locationData])


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