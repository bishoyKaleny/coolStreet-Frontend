//Use  meteo blue to fetch current temperature in celcius of munich
//and current weather condition (rain, sun, cloudy, etc)

// @CF : add api key 

import React, { useState, useEffect } from 'react';
import { ReactComponent as SunnyIcon } from "../assets/icons/weather/sunny.svg";
import { ReactComponent as CloudyIcon } from "../assets/icons/weather/cloudy.svg";
import { ReactComponent as RainyIcon } from "../assets/icons/weather/rainy.svg";
import { ReactComponent as SnowingIcon } from "../assets/icons/weather/cloudy_snowing.svg";
import { ReactComponent as PartlyCloudyDayIcon } from "../assets/icons/weather/partly_cloudy_day.svg";

//night icons in case change times.
import { ReactComponent as NightIcon } from "../assets/icons/weather/night.svg"; 
import { ReactComponent as PartlyCloudyNightIcon } from "../assets/icons/weather/partly_cloudy_night.svg";


const WeatherReportV2 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // @CF, add meteo blue apikey. 
  // @CF check that it's the correct temp (feels like, real, whatever ya'll want)
  // @CF add paremeters to api so only fetches pictocode and temperature or what you want from above line (feels like?)

  // COMMENT OUT API FOR DEVELOPMENT
  // useEffect(() => {
  //     const apiKey = 'YOURAPIKEY';
  //     const lat = 48.1351;
  //     const lon = 11.5820;

  //   fetch(`https://my.meteoblue.com/packages/current?lat=${lat}&lon=${lon}&apikey=${apiKey}`)
  //     .then(response => response.json())
  //     .then((usefulData) => {
  //       console.log(usefulData);
  //       setLoading(false);
  //       setData(usefulData);
  //       //console.log(data)
  //     })
  //     .catch((e) => {
  //       setData("Unavailable")
  //       console.error("An error occurred: ${e}")
  //     });
  // }, []);

  //use pictocode, not pictocode detailed. as pictocode is for day.
  //could add a Nebel icon for number 5 if needed

  return (
    <div className="search-bar-panel-weather">
      <div id="weather-report">
        <div className="weather-icon">

          {/* render icons based on pictocode */}
          {[1].includes(data?.data_current?.pictocode) && <SunnyIcon />}
          {[2, 3, 7, 10].includes(data?.data_current?.pictocode) && (
            <PartlyCloudyDayIcon />
          )}
          {[4, 5].includes(data?.data_current?.pictocode) && <CloudyIcon />}
          {[6, 7, 8, 11, 12, 14, 16].includes(
            data?.data_current?.pictocode
          ) && <RainyIcon />}
          {[9, 13, 15, 17].includes(data?.data_current?.pictocode) && (
            <SnowingIcon />
          )}
        </div>

        {loading && <h5>Loading...</h5>}
        {!loading && (
          <h5>Feels like {Math.round(data?.data_current?.temperature)} °C</h5>
        )}
      </div>

      <div className="flex-row-filler"></div>
    </div>
  );
};

export default WeatherReportV2;