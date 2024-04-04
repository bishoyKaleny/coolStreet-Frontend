// Route.jsx

import React from 'react';
import { Polyline } from 'react-leaflet';

import 'leaflet-polylinedecorator';
import CustomTooltip from "./CustomTooltip";


function generateGradient(index, values) {
   
    // @CF: define the standards of mapping value to color
    const color_index = Math.floor((1-values[index]) * 10);
    console.log(color_index);
    const color_ramp=['#0D1851FF', '#172572FF', '#424D88FF', '#5571AEFF', '#B3A17EFF', '#E9DEB8', '#F5D633FF',
                    '#F59D4CFF', '#F26648FF', '#A14430FF', '#A14430FF'];
    // create random color between 0-10

    return color_ramp[color_index];
  }
  
  function splitPolyline(polylineCoordinates) {
    const segments = [];
    
    for (let i = 0; i < polylineCoordinates.length - 1; i++) {
     
      segments.push([[polylineCoordinates[i][1], polylineCoordinates[i][0]], [polylineCoordinates[i + 1][1], polylineCoordinates[i + 1][0]]]);
    }
    return segments;
  }
  
const Route = ({
    routes,   // array of dict of route, contains route information
    
    comfortRoute,
    greenRoute,
    shortRoute,
    selectedRoute,
    setSelectedRoute,

    clickComfort,
    clickGreen,
    clickShort,
    
    setClickComfort,
    setClickGreen,
    setClickShort,
    routeClickable,
}) => {

    // find the polyline 
    // const polylineCoordinates = (routes.find(route => route.id === comfortRoute)).coordinates;
    const polylineCoordinates = (routes.find(route => route.id === comfortRoute)).coordinates;

    const values = polylineCoordinates.map(sub => sub[2]);

    const segments = splitPolyline(polylineCoordinates);
    // setPolylineSegments(segments);
    
    // before list updating, route index and route id are the same
    const handleRouteClick = (route_id) => {
        setSelectedRoute(route_id);

        setClickComfort(false);
        setClickGreen(false);
        setClickShort(false);
    
        if (route_id===comfortRoute){
            setClickComfort(true);
        }
        if (route_id===greenRoute){
            setClickGreen(true);
        } 
        if (route_id===shortRoute){
            setClickShort(true);
        }
    };

    return (
        <>
            {/* Render all unselected routes */}
            {routes
                .filter(route => route.id !== selectedRoute)
                .map(route => (
                    route.id === comfortRoute ? (

                        <>
                            {/* {polylineSegments.map((segment, seg_index) => ( */}
                            {segments.map((segment, seg_index) => (
                                <Polyline 
                                    key={seg_index}
                                    positions={segment} 
                                    color={generateGradient(seg_index, values)} 
                                    weight={5} 
                                    opacity={0.7} 
                                />
                            ))}

                            <Polyline
                                key={route.id}
                                positions={route.coordinates.map(coord => [coord[1], coord[0]])}
                                eventHandlers={routeClickable ? { click: () => handleRouteClick(route.id) } : null}
                                pathOptions={getPathOptions(route.id)}
                            >
                                {selectedRoute !== route.id && (
                                    <CustomTooltip index={route.id} comfortRoute={comfortRoute} greenestRoute={greenRoute} shortestRoute={shortRoute} />
                                )}

                            </Polyline>
                        </>
                    ) : (
                        <Polyline
                            key={route.id}
                            positions={route.coordinates.map(coord => [coord[1], coord[0]])}
                            eventHandlers={routeClickable ? { click: () => handleRouteClick(route.id) } : null}
                            pathOptions={getPathOptions(route.id)}
                        >
                            {selectedRoute !== route.id && (
                                <CustomTooltip index={route.id} comfortRoute={comfortRoute} greenestRoute={greenRoute} shortestRoute={shortRoute} />
                            )}

                        </Polyline>
                    )
                ))
            }

            {/* Render the selected route */}
            {routes
                .filter(route => route.id === selectedRoute)
                .map(route => (
                    route.id === comfortRoute ? (
                        <>
                            {/* {polylineSegments.map((segment, seg_index) => ( */}
                            {segments.map((segment, seg_index) => (
                                <Polyline 
                                    key={seg_index} 
                                    positions={segment} 
                                    color={generateGradient(seg_index, values)} 
                                    weight={8} 
                                    opacity={1} 
                                />
                            ))}

                            <Polyline
                                positions={route.coordinates.map(coord => [coord[1], coord[0]])}
                                eventHandlers={routeClickable ? { click: () => handleRouteClick(route.id) } : null}
                                pathOptions={getPathOptions(route.id)}
                            >
                                {selectedRoute !== route.id && (
                                    <CustomTooltip index={route.id} comfortRoute={comfortRoute} greenestRoute={greenRoute} shortestRoute={shortRoute} />
                                )}
                            </Polyline>
                        </>
                    )
                    : (
                        <Polyline
                            key={route.id}
                            positions={route.coordinates.map(coord => [coord[1], coord[0]])}
                            eventHandlers={routeClickable ? { click: () => handleRouteClick(route.id) } : null}
                            pathOptions={getPathOptions(route.id)}
                        >
                            {selectedRoute !== route.id && (
                                <CustomTooltip index={route.id} comfortRoute={comfortRoute} greenestRoute={greenRoute} shortestRoute={shortRoute} />
                            )}
                        </Polyline>
                    )
                ))
            }        
        </>
    );

    function getPathOptions(route_id) {
    // Define your conditions and corresponding styles
        if (route_id === comfortRoute) {
            return { opacity: 0};
        } else if (route_id === greenRoute) {
            return { color: (clickGreen ? '#198243FF' : '#3BC472FF'), opacity: (clickGreen ? 0.9 : 0.8)};
        } else if (route_id === shortRoute) {
            return { color: (clickShort ? '#A44A3FFF' : '#D37468FF'), opacity: (clickShort ? 0.9 : 0.6)};
        } else {
            // polyline styles for alternative path. !!! In some cases, when there are two alternative routes, click on one alternative path will make the two routes change style
            return { color: (!clickGreen && !clickShort && !clickComfort) ? '#3A5F77FF' : '#758494FF' };
        }
    }
};
export default Route;
