'use client'

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiemFsdHNhbmkiLCJhIjoiY20zaWRxcnMyMG9udTJpb21lbXlmaWZycCJ9.hCSh8bn58x-dxfv-bS08Lg';

function MapboxVideo() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null); // To store the recorded video blob
  const [videoUrl, setVideoUrl] = useState(null); // To store the video URL
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    // Initialize Mapbox GL JS
    if (mapContainerRef.current) {
      setMap(
        new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-74.0060, 40.7128],
          zoom: 10,
        })
      );
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Function to handle recording
  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      const canvas = map.getCanvas();
      const stream = canvas.captureStream(); // Use captureStream()
      const recorder = new MediaRecorder(stream); // Create a MediaRecorder instance

      recorder.ondataavailable = (event) => {
        setVideoBlob(event.data);
      };

      recorder.onstop = () => {
        console.log(videoBlob)
        // Create a URL from the Blob
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
      };

      recorder.start(); // Start recording
      setMediaRecorder(recorder);
    } else {
      // Stop recording
      setIsRecording(false);
      mediaRecorder.stop();
      console.log(videoUrl)
    }
  };

  return (
    <div className="App">
      <div ref={mapContainerRef} style={{ height: '500px' }} />
      <button onClick={handleRecord}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {videoUrl && (
        <video controls width="640" height="360" src={videoUrl} />
      )}
    </div>
  );
}

export default MapboxVideo;