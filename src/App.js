import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import './App.css';
import Legend from './components/Legend';
import Optionsfield from './components/Optionsfield';
import data from './data.geojson';
import { maxParallelImageRequests } from 'mapbox-gl';
import { Select, Container } from '@mantine/core';

mapboxgl.accessToken = 'pk.eyJ1IjoiY25wYW50ZSIsImEiOiJjbGI4MzEydWMwaDRjM3dsajc4aTh1aWdnIn0.FvbLc0We1E7oBA--QN644w';

function App() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(122.5705);
  const [lat, setLat] = useState(10.6952);
  const [zoom, setZoom] = useState(14.9);

  const options = [
    {
      name: 'Solar radiation per sqm',
      description: 'kWh/m2·year',
      stops: [
        [692.30, '#fafa6e'],
        [982.48, '#fce34c'],
        [1124.92, '#feca2a'],
        [1224.31, '#ffb000'],
        [1310.09, '#ff9400'],
        [1395.84, '#ff7500'],
        [1494.33, '#ff5000'],
        [1696.74, '#ff0000'],
      ],
      property: [
        'interpolate',
        ['linear'],
        ['get', 'solar_radiation_per_sqm'],
        ...[
          692.30, '#fafa6e',
          982.48, '#fce34c',
          1124.92, '#feca2a',
          1224.31, '#ffb000',
          1310.09, '#ff9400',
          1395.84, '#ff7500',
          1494.33, '#ff5000',
          1696.74, '#ff0000',
        ],
      ],
    },
    {
      name: 'Total solar radiation',
      description: 'kWh/year',
      stops: [
        [7063.14, '#b5e877'],
        [211463.36, '#80d582'],
        [537867.69, '#4fbf8b'],
        [1073338.90, '#1fa890'],
        [1923380.77, '#00908d'],
        [3256631.15, '#017782'],
        [8638240.16, '#1f5f70'],
        [22723028.76, '#2a4858'],
      ],
      property: [
        'interpolate',
        ['linear'],
        ['get', 'total_solar_radiation'],
        ...[
          7063.14, '#b5e877',
          211463.36, '#80d582',
          537867.69, '#4fbf8b',
          1073338.90, '#1fa890',
          1923380.77, '#00908d',
          3256631.15, '#017782',
          8638240.16, '#1f5f70',
          22723028.76, '#2a4858',
        ],
      ],
    }
  ];
  const [active, setActive] = useState(options[0]);


  useEffect(() => {
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      pitch: 50,
      bearing: -20,
      antialias: true,
      zoom: zoom
    });

    map.on('load', () => {
      map.addSource('buildings', {
        type: 'geojson',
        data: data,
        generateId: true,
      });
      
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  
      map.addLayer(
        {
          id: 'buildings-layer',
          type: 'fill-extrusion',
          source: 'buildings',
          layout: {},
          paint: {
            'fill-extrusion-height': ['get', 'height_max'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.75,
          }
        },
      );

      map.setPaintProperty(
        'buildings-layer', 
        'fill-extrusion-color',
        active.property
      );

      map.on('click', 'buildings-layer', (e) => {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <b>Building Model Information</b> <br/><br/>
          OSM ID: ${e.features[0].properties.full_id} <br/>
          Solar Radiation: ${e.features[0].properties.solar_radiation_per_sqm} <br/>
          Total Solar Radiation: ${e.features[0].properties.total_solar_radiation} <br/>
          Est. Roof Area: ${e.features[0].properties.area} <br/>
          Est. Bldg. Height: ${e.features[0].properties.height_max}
          `)
        .addTo(map);
        });
         
        // Change the cursor to a pointer when
        // the mouse is over the states layer.
      map.on('mouseenter', 'buildings-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
        });

      setMap(map);

    });
    return () => map.remove();
  }, []);

  useEffect(() => {
    paint();
  }, [active]);

  const paint = () => {
    if (map) {
      map.setPaintProperty(
        'buildings-layer', 
        'fill-extrusion-color', 
        active.property,
      );
    }
  };

  const changeState = i => {
    setActive(options[parseInt(i)]);
    map.setPaintProperty(
      'buildings-layer', 
      'fill-extrusion-color', 
      active.property,
    );
  };
  
  return (
    <div className='map'>
      <div className="sidebar">
        <h4>Iloilo City Proper Building Roofs Solar Potential</h4>
        <p>Select a layer using the dropdown menu. Click a building
          to view information.
        </p>
        <Select
          defaultValue='0'
          onChange={changeState}
          data={[
            {
              value: '0',
              label: 'Solar Radiation per Sqm',
            },
            {
              value: '1',
              label: 'Total Solar Radiation',
            },
          ]}
        />
        <Legend active={active} stops={active.stops} />
        <br/>
        <small>Data Sources: &nbsp;
            <a href="https://lipad.dream.upd.edu.ph/" target='_blank'>LiPAD</a>, &nbsp;
            <a href="https://www.openstreetmap.org/" target='_blank'>OpenStreetMap</a>, &nbsp;
            <a href="https://joint-research-centre.ec.europa.eu/pvgis-photovoltaic-geographical-information-system/pvgis-tools/tmy-generator_en" target='_blank'>EU Science Hub</a>
        </small>
      </div>
      <div ref={mapContainer} className="map-container">
    </div>
    </div>
  );
}

export default App;
