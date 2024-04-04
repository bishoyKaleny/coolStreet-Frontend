//whyai.js
//also contains the map button that opens itself.
//@CF : add some  with what kind text that is simple explanation of why ai is useful in this context
//helps develop citizen trust in responsible ai. preferred to add some kind of gif or diagram information. 


import React, { useState } from "react";
import "./modal.css";
import CloseButton from "../CloseButton";
import FaqButtons from "./FaqButtons";
import { ReactComponent as AiIcon } from "../../assets/icons/map/AI_FAQ.svg";

export default function WhyAI() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };


  //prevent that clicking the modal content triggers close
  const handleModalContent = (e) => {
    e.stopPropagation(); 
    console.log("modalcontent clicked");
  };

  return (
    <>
      {/* make button */}

      <button className="fab whyai feedback" onClick={toggleModal}>
        <div className="fab-icon">
          <AiIcon />
        </div>
        <div className="fab-text dark">Why do we use AI?</div>
      </button>
      {/* show modal */}
      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={handleModalContent}>
              <CloseButton toggleModal={toggleModal} />
              <h2>Why do we use Artificial Intelligence (AI)?</h2>

              <div className="faq-content">
                <p>
                  Calculating the shady areas for the city for every hour, every day of the year, takes a lot of time and computation power.
                  Not to mention, variables such as wind speed , xy, z, affect your comfort while walking on xy zy. That's why blah blah
                  
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon... Coming soon...Coming soon...Coming soon...Coming
                  soon...Coming soon...Coming soon...Coming soon... Coming
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon...Coming soon...Coming soon... Coming soon...Coming
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon...Coming soon... Coming soon...Coming soon...Coming
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon... Coming soon...Coming soon...Coming soon...Coming
                  soon...Coming soon...Coming soon...Coming soon... Coming
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon...Coming soon...Coming soon... Coming soon...Coming
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon...Coming soon... Coming soon...Coming soon...Coming
                  soon...Coming soon...Coming soon...Coming soon...Coming
                  soon...
                </p>
              </div>
              {/* optional additional close button
              <div className="modal-button-wrapper">
                <button className="filled close-modal cancel">Close</button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
