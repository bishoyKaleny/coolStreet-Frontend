// Map.js

//@Jiaying, I started organizing the inputs, can continue. Make sure styles/index.css is the last css import. 

//known error thrown, hasn't affected map yet (over a month): Failed to parse L.Control.locate.min.css.map. Has to do with the LocateControl
//component overriding of default css styles? 

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
  ScaleControl,
} from "react-leaflet";

import { useMap } from "react-leaflet";

////// Icons /////
import { ReactComponent as SwitchIcon } from "./assets/icons/top_nav/swap_vert.svg";
import { ReactComponent as NavigationIcon } from "./assets/icons/map/navigation.svg";
import { ReactComponent as ClockIcon } from "./assets/icons/top_nav/clock.svg";
import { ReactComponent as BackIcon } from "./assets/icons/top_nav/back_arrow.svg";
import { ReactComponent as PinDest } from "./assets/icons/map/pin_dest.svg";
import { ReactComponent as PinOrig } from "./assets/icons/map/pin_alt.svg";

//////Map functions/////
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // base leaflet styles
import "leaflet.locatecontrol"; //user location
import 'leaflet-rotate'; //compass
import "./styles/custom_leaflet.css"; //custom leaflet styles overriding SOME base styles
import "react-datepicker/dist/react-datepicker.css"; //datepicker css
import "./styles/custom_datetime.css"; //override SOME base datepicker styles

import "./styles/index.css"; //custom styles (import last before component import)

///////Components//////
import AddressForm from "./components/AddressForm";
import ChangeMapView from "./components/ChangeMapView";
import WeatherReportV2 from "./components/WeatherReportV2";
import LegendModal from "./components/Modals/LegendModal";
import FaqManager from "./components/Modals/FaqManager"
import WhyAI from "./components/Modals/WhyAI";
import Recentering from "./components/Recentering";
import Route from "./components/Route";

import RouteInfo from "./components/RouteInfo";


////// time selector////
import DatePicker from "react-datepicker";



const { BaseLayer } = LayersControl;

// define origin and destination marker idon
const destinationMarkerIcon = new L.Icon({
  iconUrl: require("./assets/icons/map/pin_dest.svg").default,
  iconAnchor: [10, 20],
});

const originMarkerIcon = new L.Icon({
  iconUrl: require("./assets/icons/map/pin_alt_large.svg").default,
  iconAnchor: [10, 20],
});

// get routing results on sidewalks. Use this getRoute function when the server is setup 
const getRoute = async (origin, destination, userTime) => {
  const startLng = origin[1];
  const startLat = origin[0];
  const endLng = destination[1];
  const endLat = destination[0];

  const apiUrl =
    `http://127.0.0.1:5000/?startLng=${startLng}&startLat=${startLat}&endLng=${endLng}&endLat=${endLat}&mode=foot-walking&time=${userTime}`;
    // @CF, change url
 
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const routes = data.features.map((feature) => feature.geometry.coordinates);
    
    // const instructions = data.features.map((feature) => feature.properties.segments);
    const properties = data.features.map((feature) => feature.properties);
    // create arraies for each properties

    return { routes, properties };
  } catch (error) {
    console.log('Server error')
    return null;
  }
};

const Map = ({userId}) => {
  
  const initialCenter = [48.137, 11.575];
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const MunichBounds = [[47.9, 11.22], [48.4, 11.9]];    // the range of Munich city

  const [showSearchBars, setShowSearchBars] = useState(false);       //whether to show the second search bar
  const [routes, setRoutes] = useState([]);                          // routing results 
  
  const [properties, setProperties] = useState("");                  // to store routes properties
  const [showNaviButton, setShowNaviButton] = useState(false);  // wheter to show the "Navigate" nutton on the map
  const [ weatherStatus, setWeatherStatus ] = useState(true);   // whether to show weather info

  const [selectedRoute, setSelectedRoute] = useState(-1); // selecedRoute equals to comfortroute index, -1 for default
  
  const [comfortRoute, setComfortRoute ] = useState(0);    // the index of the most comfortatble route
  const [shortRoute, setShortRoute ] = useState(0);      // the index of the shortest route
  const [greenRoute, setGreenRoute ] = useState(0);         // the index of the greenest route 

  const [infoPanel, setInfoPanel] = useState(false);     // whether to show the information panel
  const [showLegend, setShowLegend] = useState(false);   // whether to show the legend 

  const [originAddress, setOriginAddress] = useState("");   // set origin addresses
  const [destAddress, setDestAddress] = useState("");     // set destination address

  const [isPopupOpen, setIsPopupOpen] = useState(true);    // set the status of marker popup 

  const today =  new Date();
  // can only access the prection in 7 days
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);
  
  const [showTimeDate, setShowTimeDate] = useState(false);   // whether to show time selector
  const [selectedDate, setSelectedDate] = useState(today);   // set time and date as today by default
  const [selectedTime, setSelectedTime] = useState(today);

  const [clickComfort, setClickComfort ] = useState(true);   // whether user clicks comfort route 
  const [clickGreen, setClickGreen ] = useState(false);       // whethefr user click the greenest route
  const [clickShort, setClickShort ] = useState(false);       // whether user clikc the shortest route

  const [ heatStress, setHeatStress ] = useState(0);    // heatstress that can avoid
  const [ greenness, setGreenness ] = useState(0);      // greeness that can increase
  const [ distance, setDistance ] = useState(0);        // distance that can save

  const [ defaultStatus, setDefaultStatus ] = useState(true);    // default status is User's current location
  const [ navigatePage, setNavigatePage ] = useState(false);    // whether to show the Routing page
  const [ routeClickable, setRouteClickable ] = useState(true); // when the status is false (in Routing page, user cannot switch route by clicking)
  
  // function to create markers on the map
  const addMarker = (newMarker, isOrigin) => {
    // if the input field is not empty
    if (newMarker!==null){
      if (isOrigin) {  
        // create origin makre
        setOriginMarker(newMarker);
        setOriginAddress(newMarker.address[0]);
      } else {         
        // create destination marker
        setDestinationMarker(newMarker);
        setDestAddress(newMarker.address[0]);
      }
    } else{  
      // when the input field is empty, remove the corresponding marker
      if (isOrigin) {
        setOriginMarker(null);
        setOriginAddress("");
      } else {
        setDestinationMarker(null);
        setDestAddress("");
      }
    }
  };

  useEffect(() => {
    /* In the map landing page (only one search bar):
      destination marker is on the map while no origion marker
    */
    if (!showSearchBars && destinationMarker && !originMarker) {
      // show the "navigate" button on the page (the map landing page)
      setShowNaviButton(true);
    } else if (destinationMarker == null){
      setShowNaviButton(false);
    }
  }, [destinationMarker]);

  // handling the input changes in origin and destination addresses
  const handleOriginChange = (value) => {
    setOriginAddress(value);
  };
  const handleDestinationChange = (value) => {
    setDestAddress(value);
  };

  // switch origin and destination addresses in the search bars
  const switchInputText = () => {
    setDefaultStatus(false);

    // swap addresses in the input fields
    const tempAddress = originAddress;
    setOriginAddress(destAddress);
    setDestAddress(tempAddress);
    
    // swap origin and destination marker      
    const tempMarker = originMarker;
    setOriginMarker(destinationMarker);
    setDestinationMarker(tempMarker);
    
    // set the clickGreen and clickShort to false. The routeinfo will display comfort route by default
    setClickComfort(true);
    setClickGreen(false);
    setClickShort(false);
  };

  // go back to found location
  const fetchRoute = async () => {
    // get user selected departure date and time, if not, use current time by default
    const date = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')} `;
    const time = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
    const userTime = date+time

    // get routes 
    const results = await getRoute(
      originMarker.position,
      destinationMarker.position,
      userTime,
    );
    
    // if routing result is not empty
    if (results.routes.length > 0) {
      // create a array of route dictionary, which contains the id and coordinates of a route
      const routes_Dict = results.routes.map((coordinates, index) => ({
        id: index, 
        coordinates,
      }));
      // set route dict as routes
      setRoutes(routes_Dict || []);

      // recentering the map to the generated routes

      // turn on the information panel 
      setInfoPanel(true); 
      // get routes' properties
      setProperties(results.properties);
     
      // save properties of the three routes in three arrays
      const average_greeness = results.properties.map(entry=>entry["average greenness"]);  
      const overall_comfort = results.properties.map(entry=>entry['overall comfort']);
      const distance  = results.properties.map(entry => entry.segments[0]['distance']);

      // get the index of the most comofort, greenest, and shortest route from the arrays above
      const mostComfort_index = overall_comfort.indexOf(Math.max(...overall_comfort));
      const greenest_index = average_greeness.indexOf(Math.max(...average_greeness));
      const shortest_index = distance.indexOf(Math.min(...distance));

      // calculate the values. needs updated calculation methods
      // @CF
      setHeatStress((Math.max(...overall_comfort) - Math.min(...overall_comfort))/Math.max(...overall_comfort));
      setGreenness((Math.max(...average_greeness) - Math.min(...average_greeness))/Math.max(...average_greeness));
      setDistance(Math.max(...distance)-Math.min(...distance));

      // the route index of the most comfortable, greenest and shortest rotue
      setComfortRoute(mostComfort_index);
      setGreenRoute(greenest_index);
      setShortRoute(shortest_index);

      // set most comfortable route as selectedRoute by default
      setSelectedRoute(mostComfort_index);
    }
    
  };


  useEffect(() => {
    // get routes
    if (originMarker !== null && destinationMarker !== null){
      fetchRoute();
    } else {
      // one of the markers is empty, remove the routes on the map
      setRoutes([]);
      // close the information panel
      setInfoPanel(false);
    };
    // fetch route when one of the four variables changes
  }, [originMarker, destinationMarker, selectedDate, selectedTime]);

  // to show the second search bar on the map (Route information page)
  const toggleSearchBars = () => {
    // show the other search bar and time selector
    setShowTimeDate(true);
    setShowSearchBars(true);
    setShowNaviButton(false);
    setIsPopupOpen(false);
    setWeatherStatus(false);
    setShowLegend(true);
    
  };
  
  // function to handle go back button
  const handleBackButtonClick = () => {
    // Reset the state to go exactly back to the view before.
    setWeatherStatus(true);
    setShowSearchBars(false);
    setShowNaviButton(true);
    setInfoPanel(false);
    setShowTimeDate(false);
    setRoutes([]);
    setOriginAddress("");
    setOriginMarker(null);
    setIsPopupOpen(true);    
  };

  return (
    <div id="page-div">

      {/* when destination is filled, show a button to navigate */}
      {showNaviButton && (
        <button className="fab navigate" onClick={toggleSearchBars}>
          <div className="fab-icon">
            <NavigationIcon />
          </div>
          <label className="fab-text">Navigate</label>
        </button>
      )}

      {/* only show WhyAi button at beginning, when no nav button and weather status is there. */}
      {!showNaviButton && weatherStatus && (
        <WhyAI/>
      )}

      {/* when the navigation page is false, show map with sarch fields (Route information page) */}
      {!navigatePage && (
        <div className="huge-search-wrapper">
          <div className="search-bar-panel">
            <div className="search-bar-panel-upper">
              <div className="back-wrapper">
                {showSearchBars && (
                  // go back button
                  <button
                    className="back-button"
                    onClick={handleBackButtonClick}
                  >
                    <BackIcon />
                  </button>
                )}
              </div>
              <div className="icon-wrapper">
                {showSearchBars && (
                  // origin and destination icons
                  <>
                    <PinOrig width={20} height={20} />
                    <PinDest width={20} height={20} />
                  </>
                )}
              </div>
              <div className="search-bar-wrapper">

                {/* once user click Navigate button, two search bars will display */}
                {showSearchBars && (
                  <>
                  {/* address input field */}
                    <AddressForm
                      label="Origin"
                      addMarker={(newMarker) => addMarker(newMarker, true)}
                      defaultStatus={defaultStatus}
                      inputValue={originAddress}
                      onInputChange={handleOriginChange}
                    />
                    {/* button to swap the addresses */}
                    <button
                      className="round swap-button"
                      onClick={switchInputText}
                    >
                      <div className="round-icon">
                        <SwitchIcon />
                      </div>
                    </button>
                  </>
                )}
                <AddressForm
                  label="Destination"
                  addMarker={(newMarker) => addMarker(newMarker, false)}
                  defaultStatus
                  inputValue={destAddress}
                  onInputChange={handleDestinationChange}
                />
              </div>
            </div>

            {/* time & date selector */}
            {showTimeDate && (
              <div className="search-bar-panel-lower">
                <div className="datetime-wrapper">
                  <i className="fab-icon">
                    <ClockIcon width={20} height={20} />
                  </i>

                  <DatePicker
                    showTimeSelect
                    selected={selectedDate}
                    className="datetime-text-input-small"
                    onChange={(date) => {
                      setSelectedTime(date);
                      setSelectedDate(date);
                    }}
                    timeFormat="HH:mm"
                    dateFormat="HH:mm"
                    timeIntervals={60}
              
                    minDate={today}
                    maxDate={sevenDaysLater}
                    minTime={new Date().setHours(9, 0, 0)} // Set minTime to 9:00 AM
                    maxTime={new Date().setHours(17, 0, 0)} // Set maxTime to 17:00 AM
                  />
                </div>
                {showLegend && <LegendModal />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <Login />  */}

      <div id="map-div">

        {/* attribution, mapbox is REQUIRED WITH LOGO ON MAP*/}
        <a href="http://mapbox.com/about/maps" className="mapbox-logo" target="blank" >
          Mapbox
        </a>


        <MapContainer

          center={initialCenter}
          zoom={13}
          minZoom={11}
          maxZoom={19}
          style={{ height: "100%", width: "100%"}}
          zoomControl={false}
          attributionControl={false}
          maxBounds={MunichBounds}
        >
          {/* map scale */}
          <ScaleControl position="bottomright" imperial={false}></ScaleControl>
          {/* locate control */}
          <LocateControl />
          {/* layer contro */}


          <LayersControl position="topright">
            <BaseLayer checked name="CoolStreet Base">  
            {/* IMPORTANT @CF: repalce the mapbox token for the following three urls*/}
              <TileLayer
                url="https://api.mapbox.com/styles/v1/lyoungblood14/clsw2aumc007701qudpjk9plu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibHlvdW5nYmxvb2QxNCIsImEiOiJja2pzam9pZ2wweTRkMnlxaDVkcjFwdGkyIn0._kdFv2vZdUKvVy6FcCpluw"
                                                                                                                        
                maxZoom={22}
              />
            </BaseLayer>

            <BaseLayer name="Satellite">
              <TileLayer
                url="https://api.mapbox.com/styles/v1/jiaying999/clu9nxcxf00ts01pr30997nf0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamlheWluZzk5OSIsImEiOiJjbDd4Z2FlOTgwOHZ0M3FwNXE3dzhzZW1yIn0.rWFY-btW5sE4lxgZBbyyxw"
                maxZoom={22}
              />
            </BaseLayer>

            <BaseLayer name="Night">
              <TileLayer
                url="https://api.mapbox.com/styles/v1/jiaying999/cl800xjc4000i14p9dns9n12d/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamlheWluZzk5OSIsImEiOiJjbDd4Z2FlOTgwOHZ0M3FwNXE3dzhzZW1yIn0.rWFY-btW5sE4lxgZBbyyxw"
                maxZoom={22}
              />
            </BaseLayer>
          </LayersControl>

          {/* <RotateControl /> */}

          {/* marker creation */}
          {originMarker && (
            <Marker 
              position={originMarker.position} 
              icon={originMarkerIcon} />
          )}

          {destinationMarker && (
            <Marker
              position={destinationMarker.position}
              icon={destinationMarkerIcon}
            ></Marker>
          )}

          {/* when destination is entered while origin is empty, reset map center to destination position */}
          {destinationMarker && !originMarker && (
            <ChangeMapView position={destinationMarker.position} />
          )}
          {/* when origin is entered while destination is empty, reset map center to origin position */}
          {!destinationMarker && originMarker && (
            <ChangeMapView position={originMarker.position} />
          )}
          {/* when destination and origin are both entered, reset map center to the mid point of two makers */}
          { destinationMarker && originMarker && (
            <Recentering originPosition={originMarker.position} destinationPosition={destinationMarker.position} />
          )}

          {/* popup information about destination  */}
          {isPopupOpen && destinationMarker && !showSearchBars && (
            <>
              <Popup
                className="custom-popup"
                position={destinationMarker.position}
                offset={[0, -20]}
              >
                <div>
                  {/* place name */}
                  <h3> {destinationMarker.address[0]}</h3>
                  {/* street name and street no. Could be empty in geocoding results */}
                  {destinationMarker.address[1] && (
                    <>
                      <p>
                        {destinationMarker.address[1]}
                        {destinationMarker.address[2] &&
                          " " + destinationMarker.address[2]}
                      </p>
                    </>
                  )}
                  {/* postalcode, could be empty in geocoding results */}
                  {destinationMarker.address[3] && (
                    <p> {destinationMarker.address[3]}</p>
                  )}
                </div>
              </Popup>
            </>
          )}

          {routes.length !==0 && 
            
                <Route
      
                  routes={routes}
                
                  comfortRoute={comfortRoute}
                  greenRoute={greenRoute}
                  shortRoute={shortRoute}

                  clickComfort={clickComfort}
                  clickGreen={clickGreen}
                  clickShort={clickShort}

                  setClickComfort={setClickComfort}
                  setClickShort={setClickShort}
                  setClickGreen={setClickGreen}

                  selectedRoute={selectedRoute}
                  setSelectedRoute={setSelectedRoute}

                  routeClickable={routeClickable}
                />
          }

        </MapContainer>
      </div>
       
      {weatherStatus && (
        <>
          <WeatherReportV2 />
          <FaqManager />
        </>
      )}
      
      {infoPanel && (
        <RouteInfo
          userId={userId}

          clickComfort={clickComfort}
          clickGreen={clickGreen}
          clickShort={clickShort}

          properties={properties}

          selectedRoute={selectedRoute}

          navigatePage={navigatePage}
          setNavigatePage={setNavigatePage}
          
          heatStress={heatStress}
          distance={distance}
          greenness={greenness}   

          setRouteClickable={setRouteClickable}   
        />
      )}
    </div>
  );
};
const LocateControl = () => {
  const map = useMapEvents({
    locationfound: (location) => {
      map.flyTo(location.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    const lc = L.control
      .locate({
        position: "bottomright",
        flyTo: true,
        strings: {
          title: "Show me where I am!",
        },
      })
      .addTo(map);

    return () => {
      lc.remove(); // Remove the Locate Control when the component is unmounted
      map.stopLocate();
    };
  }, [map]);

  return null;
};

const RotateControl = () => {
  const map = useMap();

  useEffect(() => {
    const rotateControl = L.control.rotate({ position: 'topright' }).addTo(map);

    return () => {
      rotateControl.remove(); // Remove the Rotate Control when the component is unmounted
    };
  }, [map]);

  return null;
};

export default Map
