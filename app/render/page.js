// 'use client'

// import { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';
// // import loadEncoder from '../../public/mp4-encoder.js';
// import * as HME from 'h264-mp4-encoder'
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// // import { createFFMP}
// import { toBlobURL, fetchFile } from '@ffmpeg/util';
// import { simd } from "../../public/wasm-feature-detect.js";

// mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg';

// const MapComponent = () => {
//     const mapContainerRef = useRef(null);

//     useEffect(() => {
//         const map = new mapboxgl.Map({
//             container: mapContainerRef.current,
//             style: 'mapbox://styles/mapbox/satellite-v9',
//             center: [7.533634776071096, 45.486077107185565],
//             zoom: 13.5,
//             pitch: 61,
//             bearing: -160,
//             devtools: true,
//         });

//         const animate = async () => {
//             map.easeTo({
//                 bearing: map.getBearing() - 20,
//                 duration: 3000,
//                 easing: t => t,
//             });
//             await map.once('moveend');
//         };

//         map.on('load', async () => {
//             map.addSource('dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1' });
//             map.setTerrain({ source: 'dem', exaggeration: 1.5 });

//             await map.once('idle');

//             const supportsSIMD = await simd();
//             const Encoder = await loadEncoder({ simd: supportsSIMD });

//             const gl = map.painter.context.gl;
//             const width = gl.drawingBufferWidth;
//             const height = gl.drawingBufferHeight;

//             const encoder = Encoder.create({
//                 width,
//                 height,
//                 fps: 60,
//                 kbps: 64000,
//                 rgbFlipY: true,
//             });

//             let now = performance.now();
//             mapboxgl.setNow(now);
//             const ptr = encoder.getRGBPointer();

//             const frame = () => {
//                 now += 1000 / 60;
//                 mapboxgl.setNow(now);

//                 const pixels = encoder.memory().subarray(ptr);
//                 gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
//                 encoder.encodeRGBPointer();
//             };

//             map.on('render', frame);
//             await animate();
//             map.off('render', frame);
//             mapboxgl.restoreNow();

//             const mp4 = encoder.end();
//             const anchor = document.createElement("a");
//             anchor.href = URL.createObjectURL(new Blob([mp4], { type: "video/mp4" }));
//             anchor.download = "mapbox-gl";
//             anchor.click();
//         });

//         return () => {
//             map.remove(); // Cleanup on component unmount
//         };
//     }, []);

//     return <div ref={mapContainerRef} style={{ width: '960px', height: '540px' }} />;
// };

// export default MapComponent;