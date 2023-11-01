import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landingP">
      <div class="button-container">
        <button
          class="custom-button"
          onClick={() => {
            navigate("/doctor_registration");
          }}
        >
          Doctor Registration
        </button>
        <button
          class="custom-button"
          onClick={() => {
            navigate("/patient_registration");
          }}
        >
          Patient Registration
        </button>
        <button
          class="custom-button"
          onClick={() => {
            navigate("/insurer_registration");
          }}
        >
          Insurer Registration
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
