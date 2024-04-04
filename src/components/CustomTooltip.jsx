import React from 'react';
import { Tooltip } from 'react-leaflet';
import { ReactComponent as ComfortIcon } from '../assets/icons/routes/comfort.svg';
import { ReactComponent as FastIcon } from '../assets/icons/routes/fast.svg';
import { ReactComponent as GreenIcon } from '../assets/icons/routes/green.svg';

// This component is to show tooltip of route conditionaly

const CustomTooltip = ({ index, shortestRoute, greenestRoute, comfortRoute}) => {
  if (index == comfortRoute) {
    // return tooltip for comfort route if it is not clicked
    return (
      <div>
        <Tooltip permanent> 
          <ComfortIcon />
          <p className="minimal comfort">Comfort</p>
        </Tooltip>
      </div>
    );
  } 
  if (index == greenestRoute) {
    // return tooltip for green route if it is not clicked
    return (
      <div>
        <Tooltip permanent>
          <GreenIcon />
          <p className="minimal green">Green</p>

        </Tooltip>
      </div>
    );
  } 
  if (index == shortestRoute){
    // return tooltip for shortest route if it is not clicked
    return (
      <div>
        <Tooltip permanent>
          <FastIcon />
          <p className="minimal fast">Fast</p>
        </Tooltip>
      </div>
    );
  }

  if (index!==shortestRoute && index!==comfortRoute && index!==greenestRoute){
    // no tooltip for alternative route
    return null;
  }

};
export default CustomTooltip;
