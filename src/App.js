import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import './App.css';
import data from './data.geojson';
import { maxParallelImageRequests } from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY25wYW50ZSIsImEiOiJjbGI4MzEydWMwaDRjM3dsajc4aTh1aWdnIn0.FvbLc0We1E7oBA--QN644w';

function App() {
  const mapContainer = useRef(null);
  const map = useState(null);
  const [lng, setLng] = useState(122.5705);
  const [lat, setLat] = useState(10.6952);
  const [zoom, setZoom] = useState(14.7);
  const colorValues = [
    218, '#fafa6e',
    923, '#fce34c',
    1047, '#feca2a',
    1137, '#ffb000',
    1216, '#ff9400',
    1301, '#ff7500',
    1398, '#ff5000',
    1696, '#ff0000',
  ];

  const options = [
    {
      name: 'Solar radiation per sqm',
      description: 'Solar radiation per sqm (Kwh/m2·year)',
      property: 'solar_radiation_per_sqm',
      stops: [
        218, '#fafa6e',
        923, '#fce34c',
        1047, '#feca2a',
        1137, '#ffb000',
        1216, '#ff9400',
        1301, '#ff7500',
        1398, '#ff5000',
        1696, '#ff0000',
      ]
    },
    {
      name: 'Total solar radiation',
      description: 'Total solar radiation (Kwh/year)',
      property: 'total_solar_radiation',
      stops: [
        3328.82, '#b5e877',
        4650.70, '#80d582',
        69393.08, '#4fbf8b',
        95149.81, '#1fa890',
        133605.81, '#00908d',
        201606.24, '#017782',
        394596.59, '#1f5f70',
        23832627, '#2a4858',
      ]
    }
  ]



  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      pitch: 50,
      bearing: -20,
      antialias: true,
      zoom: zoom
    });

    map.current.on('load', () => {
      map.current.addSource('buildings', {
        type: 'geojson',
        data: data,
        generateId: true,
      });
  
      map.current.addLayer(
        {
          id: 'buildings-layer',
          type: 'fill-extrusion',
          source: 'buildings',
          layout: {},
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'solar_radiation_per_sqm'],
              ...colorValues,
            ],
            'fill-extrusion-height': ['get', 'bldg_height'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.75,
          }
        },
      );

      

    });
  });
  
  /*
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));      
    });
    
  });
  */
  return (
    <div className='map'>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;