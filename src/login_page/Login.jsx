//Login.jsx

import React, { useState } from "react";
import "../styles/index.css";
import "../styles/login_page.css";
import ContinueNoLogin from "./ContinueNoLogin";
import Signup from "./Signup";
import useIndexedDB from "./useIndexedDB";

export default function Login({ handleLoginSuccess }) {//prop coming from App.jsx
  const [isVisible, setIsVisible] = useState(true); // want to see it at first
  const [errorMessage, setErrorMessage] = useState(""); 
  const [defaultValue, setDefaultValue] = useState("");
  const { checkUserId } = useIndexedDB(); 
  const [userId, setUserId] = useState(""); 

  const handleInputChange = (event) => {
    setUserId(event.target.value); // Update user ID state
    setErrorMessage("");
  };

  const handleLoginClick = async (id) => {
    try { 
      console.log(id);
      cancelErrorMessage();
      const record = await checkUserId(id); // Check if the id matches a userID in the DB and retrieves the entry

      if (record) {
        setIsVisible(false); //turn off the login component if there is a record.
        console.log("User logged in successfully with id number", id);
        // Call the onLoginSuccess function passed from the parent component
        handleLoginSuccess(id);
      } else {
        setErrorMessage(
          "Oops!  No data found. Please try again or click sign up below."
        );
        console.log("No data found for user");
      }
    } catch (error) {
      console.error("Error checking user data:", error);
    }
  };

  // Function to update the default value used?
  const updateDefaultValue = () => {
    setDefaultValue("developer");
    console.log(defaultValue);
  };

  const cancelErrorMessage = () => {
    setErrorMessage("");
    console.log(defaultValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    handleLoginClick(userId); // Trigger login click when form is submitted
  };

  return (
    <>
      {isVisible && (
        <div className="login-page">
          <div className="login-content">
             <h1>Welcome</h1>
             
            {/*
            <h1>This is h1</h1>
            <h2>This is h2</h2>
            <h3>This is h3</h3>
            <h4>This is h4</h4>

            <h5>This is h5</h5>
            <p>This is p</p>
            <p className="minimal">This is p minimal</p> */}

            <h3 className="login-notify">Please log in with your user ID</h3>

            <form onSubmit={handleSubmit}>
              <div className="login-input-wrapper">
              <input
                className="text-input"
                placeholder="e.g. 222"
                value={userId}
                onChange={handleInputChange}
              ></input>

              <button
                type="submit"
                className="cancel"
               
              >
                Log in
              </button>
              </div>
            </form>
            {/* <LoginValidation handleLoginClick={handleLoginClick} defaultValue={defaultValue} /> */}
            <div className="error-message">{errorMessage}</div>

            <ContinueNoLogin
              updateDefaultValue={updateDefaultValue}
              defaultValue={defaultValue}
              handleLoginClick={handleLoginClick}
            />
            <div className="login-content bottom">
              Don't have a user ID? <Signup /> instead
            </div>
          </div>
        </div>
      )}
    </>
  );
}