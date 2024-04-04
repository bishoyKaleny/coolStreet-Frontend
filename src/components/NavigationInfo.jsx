// NavigationInfo.jsx

import React, { useState } from "react";

import { ReactComponent as BigCloseIcon } from "../assets/icons/close_white.svg";
import { ReactComponent as BackIcon } from "../assets/icons/top_nav/back_arrow_long.svg";
import { ReactComponent as ForwardIcon } from "../assets/icons/top_nav/forward_arrow_long.svg";
import { ReactComponent as LeftIcon } from "../assets/icons/routing/0.svg";
import { ReactComponent as RightIcon } from "../assets/icons/routing/1.svg";
import { ReactComponent as SharpLeftIcon } from "../assets/icons/routing/2.svg";
import { ReactComponent as SharpRightIcon } from "../assets/icons/routing/3.svg";
import { ReactComponent as SlightLeftIcon } from "../assets/icons/routing/4.svg";
import { ReactComponent as SlightRightIcon } from "../assets/icons/routing/5.svg";
import { ReactComponent as StraightIcon } from "../assets/icons/routing/6.svg";
import { ReactComponent as EnterRoundaboutIcon } from "../assets/icons/routing/7.svg";
import { ReactComponent as ExitRoundaboutIcon } from "../assets/icons/routing/8.svg";
import { ReactComponent as UTurnIcon } from "../assets/icons/routing/9.svg";
import { ReactComponent as GoalIcon } from "../assets/icons/routing/10.svg";
import { ReactComponent as KeepRightIcon } from "../assets/icons/routing/12.svg";
import { ReactComponent as KeepLeftIcon } from "../assets/icons/routing/13.svg";

import { ReactComponent as ExpandIcon } from "../assets/icons/top_nav/expand_arrow.svg";

// This component is to show navigation guide information of selected route
const NavigationInfo = ({
  properties,
  selectedRoute,
  clickComfort,
  clickCool,
  clickShort,
  setNavigatePage,
  navigatePage,
  
}) => {
  // exit navigation page when exit(x) button is clicked
  const exitNavigation = () => {
    setNavigatePage(false);   
  };
  // The navigation steps of selected route
  const steps = properties[selectedRoute].segments[0].steps;
  // the index of each step
  const [currentStep, setCurrentStep] = useState(0);
  
  // whether to open detailed navigation page. Dafault as false
  const [ stepsPage, setStepsPage ] = useState(false);

  // function handle user's click on button to the next step
  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  // function handle user's click on button to the previous step
  function lastStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // function handle user's click on button to show all navigation steps
  const showDetails = () => {
    setStepsPage(true);
  };

  // function handle user's click on button to exit page of all steps 
  const exitDetailedSteps =() => {
    setStepsPage(false);

  };

  // to get route icon based on navigation guide type
  function getRoutingIcon(type) {
    switch (type) {
      case 0:
        return <LeftIcon />;
      case 1:
        return <RightIcon />;
      case 2:
        return <SharpLeftIcon />;
      case 3:
        return <SharpRightIcon />;
      case 4:
        return <SlightLeftIcon />;
      case 5:
        return <SlightRightIcon />;
      case 6:
        return <StraightIcon />;
      case 7:
        return <EnterRoundaboutIcon />;
      case 8:
        return <ExitRoundaboutIcon />;
      case 9:
        return <UTurnIcon />;
      case 10:
        return <GoalIcon />;
      case 11:
        return <StraightIcon />;
      case 12:
        return <KeepRightIcon />;
      case 13:
        return <KeepLeftIcon />;
      default:
        return <StraightIcon />;
    }
  }

  const routingIcon = getRoutingIcon(steps[currentStep].type);
  

  if (navigatePage && !stepsPage) {
    // to show navigation page 
    return (
      <>
        <div className="navigation-info-panel">
          <div className="navigation-info-panel-upper">
          <div className="back-wrapper">
                <button className={`back-button left ${currentStep === 0 ? "disabled" : ""}`} 
                onClick={lastStep}
                >
                  <BackIcon />
                </button>
              </div>
            <div className="instructions-wrapper">
              
              <div className="back-wrapper">
                {routingIcon}
              </div>

              <h3 className="navigation-instructions">
                {steps[currentStep].instruction}
              </h3>
            </div>

            <div className="back-wrapper">
              <button className="back-button right" 
              onClick={nextStep}>
                <ForwardIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="navigation-info-panel-lower"  onClick={showDetails}> {/* click the button to show more detailed steps */}
          <button className="expand">
            <ExpandIcon/>
          </button>
          </div>
               
        <div className="route-info-panel" style={{paddingTop: '0'}}>
        
          <div className="route-info" style={{ flexDirection: "row" }}
>
          <h3 className="navigation-instructions">
            {clickComfort
              ? "You are on the comfort route"
              : clickCool
              ? "You are on the green route"
              : clickShort
              ? "You are on the fast route"
              : "You are on the alternative route"}
          </h3>
         
          </div>
          <button
            className="cancel round nav-instructions"
            onClick={exitNavigation}
          >
            <div className="round-icon">
              <BigCloseIcon />
            </div>
          </button>
        </div>
        
      </>
    );
  } else{   
    // when user open the detailed navigation guide list
    return(
   
      <div className="detailed-step-panel">
        <h2>Steps</h2>
        <ol>
            {steps.map((step, index) => (
            <li key={index} className={index === currentStep ? 'highlighted': ''}>
                {getRoutingIcon(step.type)} {step.instruction} 
            </li>
            ))}
        </ol>
        <button className="outlined detailed-back" onClick={exitDetailedSteps}>Back</button>
      </div>  
  )}
};

export default NavigationInfo;
