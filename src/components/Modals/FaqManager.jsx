//This FaqManager manages the cycling of Faqs. It also contains the
//button located in map right for opening itself.
//note that the CSS for modals is coming also from ./modal.css. To adjust the default height, adjust .faq-content
//also note that the Z-index for all css elements in the project is VERY sensitive. It is not recommended to mess with the z-indexes
// also note that if the faq-header runs over two lines (the title of each faq found in faq1, faq2 etc, it will cause the size to grow)
//@CF : Edit all FAQS (Faq1, Faq2, Faq3, Faq4, add more if wanted) with desired material. Should be quite brief, preferred with a small diagram or gif. 
//

import React, { useState } from "react";
import "./modal.css";
import { ReactComponent as FaqIcon } from "../../assets/icons/map/help.svg";
import Faq1 from "./Faq1";
import Faq2 from "./Faq2";
import Faq3 from "./Faq3";
import Faq4 from "./Faq4";
import FaqError from "./FaqError";
import FaqButtons from "./FaqButtons";
import CloseButton from "../CloseButton";

export default function Faqs() {
  const [modal, setModal] = useState(false); //don't want to see it at first
  const [currentFaq, setCurrentFaq] = useState(1); //start at Faq 1

  const toggleModal = (e) => {
    e.stopPropagation();
    setModal(!modal); //turn modal on and off
    console.log("togglemodal clicked");
    setCurrentFaq(1); //reset current faq to one
  };

  const handleModalContent = (e) => {
    e.stopPropagation(); 
    console.log("modalcontent clicked");
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentFaq((prevFaq) => (prevFaq < 4 ? prevFaq + 1 : prevFaq)); //change the < # to equal the amount you want to stop the cycle at.
    console.log("next clicked");
  };

  const handleBack = (e) => {
    e.stopPropagation();
    setCurrentFaq((prevFaq) => (prevFaq > 1 ? prevFaq - 1 : prevFaq)); // This prevents prevFaq from going under 1.
  };

  //prevents some scrolling on background. useful to disable map when open.
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  //define the switch call to rotate through the components
  let faqComponent;

  switch (currentFaq) {
    case 1:
      faqComponent = <Faq1 />;
      break;
    case 2:
      faqComponent = <Faq2 />;
      break;
    case 3:
      faqComponent = <Faq3 />;
      break;
    case 4:
      faqComponent = <Faq4 />;
      break;
    case 5:
      faqComponent = <Faq2 />;
      break;
    default:
      faqComponent = <FaqError />;
  }

  return (
    <>
      <div className="top-right-map-controls">
        {/* this is a special button that happens to appear directly below the other round map buttons
        however it is not inside the map layers. media query used to move it with the other buttons */}
        <button className="round-map" onClick={toggleModal}>
          <div className="round-icon">
            <FaqIcon />
          </div>
        </button>
      </div>

      {/*modal and render it conditionally  */}
      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={handleModalContent}>
              <CloseButton toggleModal={toggleModal} />

              {/* conditionally render Faq */}
              {faqComponent}

              {/*<div className="flex-column-filler"></div>   Could be used to help with sizing eventually...*/}
              
              {/* add buttons*/}
              <FaqButtons
                onClickBack={handleBack}
                onClickNext={handleNext}
                currentFaq={currentFaq}
                toggleModal={toggleModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
