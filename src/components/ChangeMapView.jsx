// ChangeMapView.js
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// This component is to reset the map center based on the coordinate passed 
const ChangeMapView = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      // recenter the map, keep the zoom level unchanged
      map.setView(position); 
    } 
  }, [position]);

  return null;
};

export default ChangeMapView;
