// FeedBackForm.js
import React, { useState } from "react";

function FeedBackForm({ onFormSubmit, toggleModal }) {
  const [formData, setFormData] = useState({
    routeHotness: "", // This will hold the selected radio button value
    feedback: "", // This will hold the feedback text
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="feedback-wrapper">
        <label className="input-labels" htmlFor="routeHotness">
          On a scale of 1 to 5, how comfortable was your route? 
        </label>
        <div className="radio-buttons-wrapper">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-button-label">
              <input
                type="radio"
                name="routeHotness"
                value={value}
                onChange={handleChange}
                required
              />
              {value}
            </label>
          ))}
        </div>
      </div>
      <div className="feedback-wrapper">
        <label className="input-labels" htmlFor="feedback">
          Tell us more:
        </label>
        <textarea
          id="feedback"
          className="text-input"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          
        />
      </div>

      <div className="modal-button-wrapper">
        <button type="button" className="outlined close-modal" onClick={toggleModal}>
          Cancel
        </button>
        <button type="submit" className="filled close-modal">
          Submit
        </button>
      </div>
    </form>
  );
}

export default FeedBackForm;
