// AddressForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../assets/icons/top_nav/search.svg';

// This component is to handle address input, submit, and geocoding
const AddressForm = ({ label, defaultStatus, addMarker, inputValue, onInputChange}) => {
  // address that user typed 
  const [address, setAddress] = useState('');
  // the address suggestion list of autocomplete
  const [suggestions, setSuggestions] = useState('');
  // the search button in the input field (the magnifier)
  const [searchStatus, setSearchStatus] = useState(inputValue==='' ? true : false);

  // whether to use user's current location
  const [currentLocation, setCurrentLocation ] = useState(false);
  const inputRef = useRef(null);
  // here map api parameters

  useEffect(()=>{
    // when it is the input field for origin address and it is empty, take user's current location
    if (label==='Origin' && inputValue.length === 0){ 
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation(true);
            // disable the magnifier button
            setSearchStatus(false);
            // make maker based on current location
            const newMarker = { address: ["Your location"], position: [ latitude, longitude ] };   // switch lat lon position to create marker
            addMarker(newMarker);
          },
          (error) => {
            console.error('Error getting current location:', error);
          }
        );
      }
    }
    
  },[]);
  // handling  change in the address input field
  const handleChange = (event) => {
    const inputText = event.target.value;
    setAddress(inputText);
    onInputChange(inputText);
    fetchSuggestions(inputText);
    // when user want to change input value, set currentLocation back to false to ban it
    setCurrentLocation(false);
    
    if (inputText =='') {
      // show the search (magnifier) when the input field is empty
      setSearchStatus(true);
      // turn off the autocomplete list when the input field is empty
      setSuggestions([])
      // remove marker
      addMarker(null);     
    }
  }
  // get address list of address autocomplete
  // @CF: change the geocoding autocomplete api url here.
  const fetchSuggestions = async (inputText) => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf6248b7e33a24d24a4472b34e11a6682a886d&boundary.rect.min_lon=11.41&boundary.rect.min_lat=48.05&boundary.rect.max_lon=11.66&boundary.rect.max_lat=48.24&boundary.country=DE&text=${inputText}`
      );
      const data = await response.json();

      // Update the suggestions based on the API response
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }; 

  // function to handle user click on autocomplete address list
  const handleSuggestionClick = (suggestion) => {
    
    // Handle the selection of a suggestion
    const newPosition = suggestion.geometry.coordinates;
   
    // address info of marker. idealy the address contains: place name, street name, street no., and postalcode 
    const address_info = [suggestion.properties.name, suggestion.properties.street, suggestion.properties.housenumber, suggestion.properties.postalcode]
    // create marker based on selected address
    const newMarker = { address: address_info, position: [newPosition[1],newPosition[0]] };   // switch lat lon position to create marker
    addMarker(newMarker);

    // set new address, and turn off the address list and search button
    setAddress(suggestion.properties.label);
    setSuggestions([]);
    setSearchStatus(false);

    // Update the input value with the selected suggestion
    onInputChange(suggestion.properties.label)

  };

  // geosearch funtion: transfer text address to coordinates
  // @CF: change geosearch API url
  const geoSearch = async (address) => {
    try {
      /* geosearch ORS API (sometime the correct search results is not in the first place)
      e.g. search "Jewish Museum Munich" the first result from ORS API is "Paläontologisches Museum"

      I tried different geocoding API, like Here and Nominatim. but the geosearch results are not satisfactory either.
      */ 
      const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248b7e33a24d24a4472b34e11a6682a886d&text=${address}&boundary.rect.min_lon=11.41&boundary.rect.min_lat=48.05&boundary.rect.max_lon=11.66&boundary.rect.max_lat=48.24&boundary.country=DE`);
      
      // geocode Here API (have problems of searching places by name)
      // const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${here_apikey}&bbox=${boundingBox}`);
      
      // use nominatim geocode api again
      const data = await response.json();
     
      // turn off the address list
      setSuggestions([]);
      if (data && data.features.length > 0) {
    
        // take the first search result.(Although sometimes it is not the correct one)
        const result = data.features[0]; 
        // get position and information and create marker
        const newPosition = [result.geometry.coordinates[1], result.geometry.coordinates[0],];
        const address_info = [result.properties['name'], result.properties['street'], result.properties['housenumber'], result.properties['postalcode']]
        const newMarker = { address: address_info, position: newPosition };

        addMarker(newMarker);

        // turn off the search button
        setSearchStatus(false);
        
      } else {
        console.error('Geocoding failed. Please enter a valid address.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  }
  // implement when user press "enter" button after address input
  const handleSubmit = async(event, address)=> {
    if (event.key === 'Enter') {
      geoSearch(address);
    }
  }
  // implement when user press the magn
  const searchButtonClick = (address) => {
    geoSearch(address);
  }

  return (
    <div className="text-input-container">
      {searchStatus && (
        <button className="search-icon" onClick={() => searchButtonClick(address)}>
        
          <SearchIcon></SearchIcon>
        </button>
      )}

      <input
        type="text"
       
        value={(currentLocation && defaultStatus) ? 'Your location' : inputValue}
        placeholder="Search"
        className="text-input"
        onChange={handleChange}
        onKeyDown={(event) => handleSubmit(event, address)}
        ref={inputRef}
      />
      {label === 'origin' && (
        <button className="current-location-button" >
          Use Current Location
        </button>
      )}

      {/* Display autocomplete suggestions--- cut at 5 suggestions */}
      {suggestions.length > 0 && (
        <ul className='suggestion-list'>
          {suggestions.slice(0, 5).map((suggestion) => (
            <li key={suggestion.properties.label} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.properties.label}
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default AddressForm;
