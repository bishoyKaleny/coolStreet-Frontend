import React from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";

export default function CloseButton ({ toggleModal }) {


  return (
    <button className="back-button close" onClick={toggleModal}>
                <CloseIcon />
              </button>
  );
}
