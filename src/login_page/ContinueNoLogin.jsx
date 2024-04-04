//continuenologin 
//this component takes the default login code, developer, and uses it to login the user. 
//eventually it would be wise to separate developer and dummy user. 


import React, { useState, useEffect } from "react";
import "../components/Modals/modal.css";

export default function ContinueNoLogin({ handleLoginClick, updateDefaultValue, defaultValue}) {//props from Login.jsx 
    const [modal, setModal] = useState(false);

    useEffect(() => {
        // Call handleLoginClick when defaultValue changes
        if (defaultValue !== "") {
            handleLoginClick(defaultValue);
        }
    }, [defaultValue]);

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleContinueClick = () => {
        updateDefaultValue(); // Call the function to send default value to the sibling component
        toggleModal(); // Close the modal
    };

    return (
        <>
            <button className="login-page-text" onClick={toggleModal}>
                Continue without logging in
            </button>

            {modal && (
                <div className="modal">
                    <div className="overlay">
                        <div className="modal-content">
                            <h2 className="faq-header">Are you sure?</h2>
                            <p>
                                If you continue without logging in, the app will be unable to calculate your personal comfort.
                            </p>
                            <p>
                                Instead, the calculations will be based on a 35 year old male with a height of 1.75m and weight of 75kg.
                            </p>
                            <div className="modal-button-wrapper">
                                    <button className="filled close-modal" onClick={toggleModal}>No, login</button>
                                    <button className="outlined close-modal" onClick={handleContinueClick}>Yes, continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}