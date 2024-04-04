//legendModal.jsx
//user can click legend for some more information 
//@CF / @Jiaying: would be great to have a much better diagram/ explanation, maybe some nice drawings of cold people, or even some emoji

import React, { useState } from "react";
import "./modal.css";
import CloseButton from "../CloseButton";
import { ReactComponent as LegendSVG } from "../../assets/legend_v2.svg";
import { ReactComponent as ConfidenceExplanSVG } from "../../assets/confidence_explanation.svg";
import { ReactComponent as LegendDiagram } from "../../assets/legend_explanation.svg";

export default function Faqs() {
  const [modal, setModal] = useState(false); //don't want to see it at first

  const toggleModal = (e) => {
    e.stopPropagation();
    setModal(!modal); //toggle
    console.log("togglemodal clicked");
  };

  const handleModalContent = (e) => {
    e.stopPropagation();
    console.log("modalcontent clicked");
  };

  //prevents scrolling on background
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <> 
      {/*trigger modal when user clicks on legend  */}
      <div className="legend">
        <button className="legend" onClick={toggleModal}>
          <LegendSVG />
        </button>
      </div>

      {/*render Modal conditionally  */}
      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={handleModalContent}>
              <div className="legend-modal-content">
                <CloseButton toggleModal={toggleModal} />
                <h3>Legend</h3>
                <image className="legend-svg">
                  <LegendDiagram />
                </image>

                <p>The data points along the comfort route show which parts of your route 
                  will be just right, and which might be warm or cold. Blues indicate cool and cold temperatures, while yellows and reds indicate warm and hot temperatures.</p>

                {/* TODO if used*/}
                <p>
                  Some explanation of the transparency if used in the final app.
                </p>
                <image className="legend-svg">
                  <ConfidenceExplanSVG />
                </image>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
