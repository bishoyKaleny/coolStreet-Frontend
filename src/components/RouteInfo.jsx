// RouteInfo.jsx

import React from 'react';
import { ReactComponent as Routingicon } from "../assets/icons/bottom_nav/routing_start.svg";
import { ReactComponent as RoutingIconAlt } from "../assets/icons/bottom_nav/routing_start_alt_300.svg";
import Feedback from './Modals/Feedback';
import NavigationInfo from './NavigationInfo';
import { useState } from 'react';

// This component is to show corresponding route information of clicked route in the routeinfo panal on the app page
const RouteInfo = ({ userId, clickComfort, clickGreen, clickShort, properties, selectedRoute, setNavigatePage, 
                        navigatePage, heatStress, distance, greenness, setRouteClickable}) => {
    
    // function to handle user clicking the "start" button on rotueinfo panel
    const handleStart= () => {
        // Show the navigation panel and hide other route information
        setNavigatePage(true);
    };
    // when the start button is clicked, navigationinfo panel and feedback button appear
    if (navigatePage){
        setRouteClickable(false);   //  make the routes unclickable
        return (
            
            <>
                <NavigationInfo properties={properties} selectedRoute={selectedRoute} 
                clickComfort={clickComfort} clickGreen={clickGreen} clickShort={clickShort} 
                setNavigatePage={setNavigatePage} navigatePage={navigatePage} 
               />

                <Feedback userId={userId}></Feedback>
            </>
        )
    }
    
    // otherwise show route info
    else {
        setRouteClickable(true);   //  make the routes clickable agian
        return (
            <>
            <div className="route-info-panel">
                <div className="route-info">
                    {/* the most comfort route could also be the shortest and greenest route */}
                    {/* priority: comfort > green > short */}
                    {/* @CF: replace the equation of calculating numenic value of route's attribute here. E.g. 25% less heat stree, 17% greener ... */}

                    {clickComfort && (
                        <>
                        <div className="route-info-header comfort-color">Comfort</div>
                        {/* calculate the percentage of comfort level */}
                        <div className="route-info-body">
                            
                            {Math.round(heatStress*100,2)}% less heat stress
                            
                            {clickGreen && (
                                <div className="route-info-body"> {Math.round(greenness*100)} % greener</div>
                            )}
                            {clickShort && (     
                                // the walking speed is 1.39m/s, calculated from results returned by ors
                                <div className="route-info-body"> 
                                    {Math.round(distance/(1.39*60)) > 1 ? Math.round(distance/(1.39*60)): 1} min faster  
                                
                                </div>
                            )}
                        </div>

                        {/* potential more info button if wanted 
                        <button className="login-page-text" style={{margin: "0", padding: "0"}}>
                            more info
                        </button>  */}

                        </>
                    )}
                    {/* when it is the greenest route, while not the most comfortable route */}
                    {clickGreen && !clickComfort && (
                        <>
                            <div className="route-info-header green-color"> Green </div>
                            <div className="route-info-body green-color">{Math.round(greenness*100)}% greener </div>

                            {clickShort && (
                                <div className="route-info-body green-color"> 
                                    {Math.round(distance/(1.39*60)) > 1 ? Math.round(distance/(1.39*60)): 1} min faster 
                                </div>
                            )}
                        </>
                    )}
                    {/* when the selected route is only the shortest */}
                    {clickShort && !clickComfort && !clickGreen &&(
                        <>
                            <div className="route-info-header fast-color"> Fastest </div>
                            <div className="route-info-body fast-color">
                                {Math.round(distance/(1.39*60)) > 1 ? Math.round(distance/(1.39*60)): 1} min faster 
                            </div>
                        </>
                    )}
                    {/* when the selected route has no paiticular attribute */}
                    {!clickShort && !clickComfort && !clickGreen &&(
                        <>
                            <div className="route-info-header alt-color"> Alternative </div>
                        </>
                    )}
                </div>

                {/* show the distance and duration of selected route */}
                <div className="distance-info">
                    <p className="minimal">
                        {(properties[selectedRoute].segments[0].distance / 1000).toFixed(2)} km
                    </p>
                    <p className="minimal">

                        {properties[selectedRoute].segments[0].duration / 60 >= 60
                            ? (properties[selectedRoute].segments[0].duration / 3600 >= 1 && properties[selectedRoute].segments[0].duration / 3600 < 2
                                ? `${(properties[selectedRoute].segments[0].duration / 3600).toFixed(1)} hours`
                                : `${Math.round(properties[selectedRoute].segments[0].duration / 3600).toFixed(2)} hours`)
                            : `${Math.round(properties[selectedRoute].segments[0].duration / 60).toFixed(0)} min`}
                    </p>
                </div>
                {/* show the "start" button*/}
                <div className="route-me">
                    <button className={`fab startroute ${clickComfort ? 'comfort-bck-color' : clickGreen ? 'green-bck-color' : clickShort ? 'fast-bck-color' : ''}`} onClick={handleStart}>
                     
                        <div className="fab-icon">
                            <RoutingIconAlt />
                        </div>
                        <label className="fab-text">Start</label>
                    </button>
                </div> 
            </div>
            </>
        )
    }
}
    
export default RouteInfo;
