//Signup form seen on the login page.
//The userId starts as "stranger" to display, and is set either after a signUp or a login by the user. When a signUp is performed, 
//a new userId is generated and saved in the indexedDB and then displayed, while in the login the userId needs to be checked in the DB. 
//The userId also affects the Feedback component and will affect all the other components that require a link to the user.

import React, { useState } from "react";
import "../components/Modals/modal.css";
import SignUpForm from "./SignupForm";
import { ReactComponent as LoginLine } from "../assets/login_line.svg";
import CloseButton from "../components/CloseButton";
import useIndexedDB from "./useIndexedDB"; // custom hook

export default function Signup() {
  const [modal, setModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState("stranger"); //greet user, default can be changed. dynamically updated with userId later
  const [whyAsking, setWhyAsking] = useState(false);
  const [toast, setShowToast] = useState(false); //copy toast. 

  // Function to generate a random code
  const generateUserId = () => {
    return Math.random().toString(36).substring(2, 10); // Generate an 8-character random alphanumeric code
  };

  //why asking page
  const toggleWhyAsking = () => {
    setWhyAsking(!whyAsking);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const { handleAddData, deleteDatabase } = useIndexedDB(); // Extract into variables from hook, names stay.  

  //delete database, to use on startup. Sometimes there is an issue where the database needs to be deleted. That
  //can be done here. It should be done once and commented out again.
  //deleteDatabase();

  //Add data into table "person" on the submission
  const handleFormSubmit = async(formData) => {
    // Call the handleAddData function obtained from the hook
    try {
      const newUserId = generateUserId(); // Generate a code
      console.log({ newUserId }); // Log the newUserId instead of userId
      setUserId(newUserId); //used for display in the UI
      handleAddData(formData, newUserId); 
      setSuccessMessage("Form submitted successfully!");  
    } catch (error) {
      console.error("Error adding data:", error);
      setSuccessMessage("Error submitting form. Please try again.");
    }
  };

  //allow the user to copy the usercode directly to the clipboard for use.
  //BUG: we suspect that it doesn't work on mobile because it is not https. 
  //@CF, verify when https established 
  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setShowToast(true); // Show the toast when the code is copied
    setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
  };

  return (
    <>
      <button className="login-page-text signup" onClick={toggleModal}>
        Sign up
      </button>

      {modal && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <div>
                <CloseButton toggleModal={toggleModal} />

                <h2>Hello, {userId}!</h2>
                {!successMessage && (
                  <p className="minimal">
                      Every person experiences a hot day differently. Based on
                      the information you provide below, we can calculate your
                      perceived temperature along your route. This helps you to
                      understand which parts of your route will be coolest,
                      warmest, or just right.
                    </p>
                )}

                {/* render svg line */}
                <LoginLine />

                {/* render confirmation if success message filled */}
                {successMessage && (
                  <div className="confirm-user-code">
                    <h5>Your user code: </h5>
                    <div className="modal-button-wrapper justify-space-between-between">
                      <h1 className="user-code">{userId}</h1>

                      {/* if toast is false, then show that user can copy code */}
                      {!toast && (
                        <button className="text minimal" onClick={handleCopy}>
                          Copy
                        </button>
                      )}

                      {/* render toast if true state*/}
                      {toast && (
                        <p className="minimal" style={{ padding: "16px" }}>
                          Done!
                        </p>
                      )}
                    </div>

                    <h5>Write this code down!</h5>
                    <h5>There is no way to recover a lost code.</h5>
                    <div className="justify-space-between modal-button-wrapper">
                      <button
                        className="filled close-modal"
                        onClick={toggleModal}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}

                {/* render sign up form if successMessage not filled and whyAsking is not open */}
                {!successMessage && !whyAsking && (
                  <SignUpForm
                    onFormSubmit={handleFormSubmit}
                    userId={userId}
                    toggleWhyAsking={toggleWhyAsking}
                  />
                )}

{/* @CF Fill in with why info is necessary */}
                {/* render why asking if it is open */}
                {whyAsking && (
                  <div className="faq-content">
                    <div className="input-labels">Sex:</div>
                    <h5>
                      A sentence explanation that should be about this long. It
                      should be two sentences and may provoke some scrolling{" "}
                    </h5>
                    <div className="input-labels">Age</div>
                    <h5>
                      Younger and elderly populations are more at risk for
                      heat-related... Additionally, these populations are more
                      sensitive to how hot it feels.{" "}
                    </h5>
                    <div className="input-labels">Height</div>
                    <h5>
                      Taller individuals have Coming soon...
                    </h5>
                    <div className="input-labels">Weight</div>
                    <h5>
                      Coming soon...
                      It should be two sentences and may provoke some scrolling
                    </h5>
                    <button className="cancel" onClick={toggleWhyAsking}>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}