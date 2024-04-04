// Recentering.js
import { marker } from 'leaflet';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// This component is to recenter the map when there are two markers on the map
const Recentering = ({ originPosition, destinationPosition }) => {
    const map = useMap();
    const markers = [
        { position: originPosition},
        { position: destinationPosition}
    ];
    // calculate the bounds of the origin and destination
    const bounds = markers.map(marker => marker.position);

    useEffect(() => {
        // get the proper zoom level by giving the boudns
        const zoomLevel = map.getBoundsZoom(bounds);
        // get the new center of the map. Formart: [lat, lng]
        const center = [(originPosition[0]+destinationPosition[0])/2 , (originPosition[1]+destinationPosition[1])/2]
        // reset the center and zoom level of the map (zoom value-1 to make sure no geometries are hidden by other app elements)
        map.setView(center, zoomLevel-1);
    });
}
export default Recentering;
