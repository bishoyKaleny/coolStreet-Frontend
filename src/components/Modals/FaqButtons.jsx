import React from "react";

export default function FaqButtons({
  onClickBack,
  onClickNext,
  currentFaq,
  toggleModal,
}) {
  return (
    <div className="modal-button-wrapper">
      <button
        // change button to disabled when at first
        className={`outlined close-modal ${currentFaq === 1 ? "disabled" : ""}`}
        onClick={onClickBack}
      >
        Back
      </button>

      <button
        // change button to cancel when at last. needes to be UPDATED if you add more FAQs

        className={`filled close-modal ${currentFaq === 4 ? "cancel" : ""}`}
        onClick={currentFaq === 4 ? toggleModal : onClickNext}
      >
        {currentFaq === 4 ? "Close" : "Next"}
      </button>
    </div>
  );
}
