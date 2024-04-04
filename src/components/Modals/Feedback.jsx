//feedback.js 
//parent and container for the feedback form and also contains the map button that opens itself. 
//@CF : edit with what kind of feedback you want to receive. Parent is routeinfo because that is where the conditional statement to
//display the NavigationInfo appears, and this button for feedback always displays when NavInfo is fired 

import React, { useState } from "react";
import "./modal.css";
import FeedBackForm from "./FeedbackForm";
import CloseButton from "../CloseButton";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/routing/feedback.svg";
import useIndexedDB from "../../login_page/useIndexedDB";

export default function Feedback({ userId }) {
  const [modal, setModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [toast, setShowToast] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const { handleAddFeedback } = useIndexedDB(); // Destructure the function from the hook

  const handleFormSubmit = (formData) => {
    // Call the handleAddData function obtained from the hook
    try {
      handleAddFeedback(userId, formData);
      setSuccessMessage("Form submitted successfully!");
      toggleModal();
    } catch (error) {
      console.error("Error adding data:", error);
      setSuccessMessage("Error submitting form. Please try again.");
    }
  };

  return (
    <>
      <button className="fab feedback" onClick={toggleModal}>
        <div className="fab-icon" style={{marginTop: '5px'}}>
          <FeedbackIcon />
        </div>
        <div className="fab-text dark">Leave feedback here</div>
      </button>

      {modal && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <CloseButton toggleModal={toggleModal} />

              <h2>Let us know!</h2>

              {/* render confirmation if successmessage filled */}
              {
                <FeedBackForm
                  onFormSubmit={handleFormSubmit}
                  toggleModal={toggleModal}
                  successMessage={successMessage}
                />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
