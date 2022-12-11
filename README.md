# Iloilo City Proper Building Roof Solar Potential

## About
This is a project under my GmE 231 (LiDAR Remote Sensing) class. We were tasked to replicate an existing study on LiDAR applications. I picked Prieto et. al (2019) study on a methodology for computing solar potential of building roofs, creating 3D models, and presenting them in a web application. 

My chosen study area is the Iloilo City Proper. It is the center of trade in the city and filled with commercial buildings.

For my project, I used and changed some of the methodology proposed by Prieto et. al (2019). Instead of using Cesium and CityGML, I used Mapbox and GeoJSON for my web application and data model.

The output is a simple web application showing the solar potential of building roofs. The solar potential computation was done in QGIS using the SEBE toolbox.

## Installation
Clone the project
```
git clone https://github.com/nikkopante/iloilo-solar-app.git
```
Enter the project directory and install dependencies
```
cd iloilo-solar-app
npm install
```
Start the project
```
npm start
```

## Data Sources
1. [LiPAD](https://lipad.dream.upd.edu.ph/) - LiDAR data on Iloilo City.
2. [EU Science Hub](https://joint-research-centre.ec.europa.eu/pvgis-photovoltaic-geographical-information-system/pvgis-tools/tmy-generator_en) - Typical Meteorological Year (TMY).
3. [OpenStreetMap](https://www.openstreetmap.org/#map=19/10.69289/122.57010) - I used the QuickOSM plugin in QGIS to get building footprints.

## References
Prieto, I.; Izkara, J.L.; Usobiaga, E. The Application of LiDAR Data for the Solar Potential Analysis Based on Urban 3D Model. Remote Sens. 2019, 11, 2348. https://doi.org/10.3390/rs11202348

