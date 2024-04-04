import React, { useState } from "react";

function SignUpForm({ onFormSubmit, toggleWhyAsking }) {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    sex: 1, //(male=1, female=2)
  });  

  //when any value in the form change, handleChange is called. 
  //the new value is passed as e.target. 
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
    
  };

  const handleSubmit = (e) => {
    e.preventDefault(); //allow custom button to be the submit button, not just first button.
    onFormSubmit(formData); // Pass formDataForDB to onFormSubmit function
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="signup-wrapper">
        <label className="input-labels" htmlFor="sex">
          Sex:{" "}
        </label>
        <select
          id="sex"
          name="sex"
          className="text-input signup"
          value={formData.sex}
          onChange={handleChange}
          required
        >
          <option value="1">Male</option>
          <option value="2">Female</option>
          {/* <option value="3">Other</option> */}
        </select>
      </div>
      <div className="signup-wrapper">
        <label className="input-labels" htmlFor="age">
          Age:{" "}
        </label>
        <input
          type="number"
          id="age"
          className="text-input signup"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          min="1" //here is where to change the possible entries allowed
          max="105"
        />
      </div>
      <div className="signup-wrapper">
        <label className="input-labels" htmlFor="height">
          Height (cm):{" "}
        </label>
        <input
          type="number"
          id="height"
          className="text-input signup"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
          max="300"
        />
      </div>
      <div className="signup-wrapper">
        <label className="input-labels" htmlFor="weight">
          Weight (kg):{" "}
        </label>
        <input
          type="number"
          id="weight"
          className="text-input signup"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          required
        />
      </div>
      
{/* why asking and submit buttons */}
      <div className="modal-button-wrapper">
        <button type="button" className="text minimal" onClick={toggleWhyAsking}>
          Why are we asking this?
        </button>
        <button type="submit" className="filled close-modal">
          Sign Up
        </button>
      </div>
    </form>
  );
}

export default SignUpForm;
