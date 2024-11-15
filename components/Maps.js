import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ data }) => {
  const coord = data.coord
  const track = data.track
  const trackArray = track.map(item => [item.coord[0], item.coord[1]])
//   trackArray.push([coord[0], coord[1]])
  console.log(trackArray)

  useEffect(() => {
    // Ensure Leaflet only runs on the client-side
    const map = L.map('map', {
        center: [coord[0], coord[1]],
        zoom: 12,
        preferCanvas: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    

    // Optional: Add a marker
    // L.marker([coord[0], coord[1]]).addTo(map)
    //   .bindPopup('GPS Location')
    //   .openPopup();

    const svgIcon = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7A59FC" width="32" height="32">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
        </svg>
      `);
  
      // Create a custom Leaflet icon using the SVG data URL
      const customIcon = L.icon({
        iconUrl: `data:image/svg+xml,${svgIcon}`,
        iconSize: [32, 32], // Adjust size as needed
        iconAnchor: [16, 32], // Center the icon as needed
        popupAnchor: [0, -32], // Adjust the popup position relative to the icon
      });

    L.marker([coord[0], coord[1]], { icon: customIcon })
        .addTo(map)
        .bindPopup('Tracking Location')
        .openPopup();

    L.polyline(trackArray).addTo(map)

    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    return () => {
      map.remove();
    };
  }, [coord]);

  return <div
            id="map"
            // className='h-96 w-96'
            style={{
                height: '600px',
                width: '1200px'
            }}
        />;
};

export default Map;