// Route.jsx

import React from 'react';
import { Polyline } from 'react-leaflet';
import { useState, useEffect } from 'react';
import CustomTooltip from "./CustomTooltip";

import 'leaflet-polylinedecorator'; 
import ReactLeafletMultiOptionsPolyline from 'react-leaflet-multi-options-polyline';
// import { MultiOptionsPolyline } from 'react-leaflet-multi-options-polyline';
import { Hotline } from 'react-leaflet-hotline';

/* @CF
This is the backup file that inclues three different ways of visualizing the ComfortRoute:

- interative polyline  (the method used in Route.jsx): 
  iteratively create polyline segments with different colors based segment values

- leaflet hotline: 
  render polyline with different color based on values, with color transition between colors, has no dotted line style
  
- ReactLeafletMultiOptionsPolyline:
  render polyline with different color, has dotted line style and has automated centering of created line


Can change ComfortRoute style by using other package

(............ This component can be deleted ...............)
*/


function generateGradient(index, values) {
  // Calculate color gradient based on polyline coordinates

  const color=['blue', 'green', 'red'];    // for example
  const color_index = values[index];
 
  return color[color_index];
}
// split polyline into series of segments
function splitPolyline(polylineCoordinates) {
  const segments = [];
  
  for (let i = 0; i < polylineCoordinates.length - 1; i++) {
    segments.push([[polylineCoordinates[i][1], polylineCoordinates[i][0]], [polylineCoordinates[i + 1][1], polylineCoordinates[i + 1][0]]]);
  }
  return segments;
}

const Route = ({
  route,
  index,
  comfortRoute,
  coolRoute,
  shortRoute,
  selectedRoute,
  setSelectedRoute,

  setClickComfort,
  setClickCool,
  setClickShort,
 
}) => {

  const [polylineSegments, setPolylineSegments] = useState([]);
   
  const [ coolColor, setCoolColor ] = useState(' #91b6a7 ');
  const [ shortColor, setShortColor ] = useState(' #c8af9c ');
  const [ otherColor, setOtherColor ] = useState(' #b9b3ae ');
  
  const polylineCoordinates = route;
  const values = polylineCoordinates.map(coord => coord[2]); // Assuming the third value of each coordinate is used for color


  // convert linestring format to point type (for Leaflet.Hotline)
  const pointArray = polylineCoordinates.map(([lng, lat, value]) => ({
    lng, lat, value }));

  // parameters of ReactLeafletMultiOptionsPolyline
  const multiOptions = {
    polylineOptions: {
      optionIdxFn: function (latLng) {
      
        const shade_value = latLng.value; // Assuming the temperature is the third element in the coordinate array        
        return shade_value > 0 ? 8 : 0;
      },
      // the same color of legend
      // Define color options for different temperature ranges
      options: [
          { color: '#0D1851FF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // extreme cold stress
          { color: '#172572FF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // very strong cold stress
          { color: '#424D88FF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // strong cold stress
          { color: '#5571AEFF', dashArray: '1, 15', opacity: 0.6, weight: 8}, //moderate cold stress
          { color: '#B3A17EFF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // slight cold stress
          { color: '#E9DEB8', dashArray: '1, 15', opacity: 0.6, weight: 8}, // no thermal stress
          { color: '#F5D633FF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // moderate heat stress
          { color: '#F59D4CFF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // strong heat stress
          { color: '#F26648FF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // very strong heat stress
          { color: '#A14430FF', dashArray: '1, 15', opacity: 0.6, weight: 8}, // extreme heat stress
      ],
    }    
  };

  // style options for <hotline> component
  const options = { 
    palette: [{r: 13, g: 24, b: 81, t: 0}, {r: 23, g: 37, b: 144, t: 0.2}, 
              {r: 66, g: 77, b: 136, t: 0.3}, {r: 85, g: 113, b: 174, t: 0.4},
              {r: 179, g: 161, b: 126, t: 0.5}, {r: 233, g: 222, b: 184, t: 0.6},
              {r: 245, g: 214, b: 51, t: 0.7}, {r: 245, g: 157, b: 76, t: 0.8},
              {r: 242, g: 102, b: 72, t: 0.9}, {r: 161, g: 68, b: 48, t: 1}],
    min: 0,
    max: 1,
    outlineWidth: 5,
    outlineColor: 'blue',
    weight: 8
  };

  useEffect(() => {
    const segments = splitPolyline(polylineCoordinates);
    setPolylineSegments(segments);
  }, []);

  const handleRouteClick = (index) => {
    setSelectedRoute(index);
    // reset all to false first here
    setClickComfort(false);
    setClickCool(false);
    setClickShort(false);
  
    if (index===comfortRoute){
      setComfortColor('#058ce7');
      setClickComfort(true);
    }
    if (index===coolRoute){
      setCoolColor('#73ab94');
      setClickCool(true);
    } 
    if (index===shortRoute){
      setShortColor('#a47e62')
      setClickShort(true);
    }
    if (index != comfortRoute && index != coolRoute && index != shortRoute){
      setOtherColor('#9b928c');
    }
  };

  if (index === comfortRoute) {
    return (
      // make two polilines overlap each other, make route easier to click and tooltip more organized
      <React.Fragment key={index}>
        {/* using ReactLeafletMultiOptionsPolyline */}
        <ReactLeafletMultiOptionsPolyline 
          positions={pointArray}
          {...multiOptions['polylineOptions']}
          eventHandlers={{
            click: () => handleRouteClick(index),
          }}
        >          
        </ReactLeafletMultiOptionsPolyline>

        {/* using Hotline component */}
        <Hotline
          key={index}
          data={pointArray}
          getLat={t => t.lat}
          getLng={t => t.lng}
          getVal={t => (1 - t.value)}
          options={options}
          eventHandlers={routeClickable ? { click: () => handleRouteClick(index) } : null}
        />

        {/* interatively created pol;yline */}
        {polylineSegments.map((segment, seg_index) => (
          <Polyline key={seg_index} positions={segment} color={generateGradient(seg_index, values)} weight={5} opacity={0.8} dashArray="1 25" />
        ))}

        {/* multioptionspolyline */}
      </React.Fragment>
    );
  } 
  else if (index === coolRoute) {
    return (
      <Polyline
        key={index}
        positions={route.map((coord) => [coord[1], coord[0]])}
        color={coolColor}
        opacity={0.7}
        eventHandlers={{
          click: () => handleRouteClick(index),
        }}
      >
        {selectedRoute !== index && (
          <CustomTooltip index={index} comfortRoute={comfortRoute} coolestRoute={coolRoute} shortestRoute={shortRoute} />
        )}
      </Polyline>
      
    );
  } else if (index === shortRoute) {
    return (
      <Polyline
        key={index}
        positions={route.map((coord) => [coord[1], coord[0]])}
        color={shortColor}
        opacity={0.7}
        eventHandlers={{
          click: () => handleRouteClick(index),
        }}
      >
        {selectedRoute !== index && (
          <CustomTooltip index={index} comfortRoute={comfortRoute} coolestRoute={coolRoute} shortestRoute={shortRoute} />
        )}
      </Polyline>
    );
  } else {
    return (
      <Polyline
        key={index}
        positions={route.map((coord) => [coord[1], coord[0]])}
        color={otherColor}
        opacity={0.7}
        eventHandlers={{
          click: () => handleRouteClick(index),
        }}
      >
        {selectedRoute !== index && (
          <CustomTooltip index={index} comfortRoute={comfortRoute} coolestRoute={coolRoute} shortestRoute={shortRoute} />
        )}
      </Polyline>
    );
  }
};
export default Route;
