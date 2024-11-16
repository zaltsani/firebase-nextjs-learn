import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import useFirebaseData from '@/app/lib/useFirebaseData';

const Map = () => {
  const { data, loading } = useFirebaseData('/')
  // const coord = data.coord
  // const track = data.track
  // const trackArray = track.map(item => [item.coord[1], item.coord[0]])
//   trackArray.push([coord[0], coord[1]])
  // console.log(trackArray)

  // useEffect(() => {
    // Ensure Leaflet only runs on the client-side
    // const map = L.map('map', {
    //     center: [coord[0], coord[1]],
    //     zoom: 12,
    //     preferCanvas: true
    // });

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors'
    // }).addTo(map);
    

    // Optional: Add a marker
    // L.marker([coord[0], coord[1]]).addTo(map)
    //   .bindPopup('GPS Location')
    //   .openPopup();

  //   const svgIcon = encodeURIComponent(`
  //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7A59FC" width="32" height="32">
  //         <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
  //       </svg>
  //     `);
  
  //     // Create a custom Leaflet icon using the SVG data URL
  //     const customIcon = L.icon({
  //       iconUrl: `data:image/svg+xml,${svgIcon}`,
  //       iconSize: [32, 32], // Adjust size as needed
  //       iconAnchor: [16, 32], // Center the icon as needed
  //       popupAnchor: [0, -32], // Adjust the popup position relative to the icon
  //     });

  //   L.marker([coord[0], coord[1]], { icon: customIcon })
  //       .addTo(map)
  //       .bindPopup('Tracking Location')
  //       .openPopup();

  //   L.polyline(trackArray).addTo(map)

  //   setTimeout(() => {
  //       map.invalidateSize();
  //   }, 0);

  //   return () => {
  //     map.remove();
  //   };
  // }, [coord]);

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [107.746053, -6.916904],
      zoom: 10.12,
    });

    // new mapboxgl.Marker()
    //   .setLngLat([coord[1], coord[0]])
    //   .addTo(mapRef.current);
    // console.log(data['001'])

    for (const userId in data) {
      const userData = data[userId]
      const coordUser = userData['coord']
      // console.log(coordUser)
      
      new mapboxgl.Marker({ color: 'blue', rotation: 0 })
        .setLngLat([coordUser[1], coordUser[0]])
        .addTo(mapRef.current)
    }

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
  }, [data])


  return <div
            id="map"
            className='h-screen w-full'
            // style={{
            //     height: '600px',
            //     width: '1200px'
            // }}
            ref={mapContainerRef}
        />;
};

export default Map;