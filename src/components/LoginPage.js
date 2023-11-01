import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landingP">
      <div class="button-container">
        <button
          class="custom-button"
          onClick={() => {
            navigate("/doctor_login");
          }}
        >
          Doctor Login
        </button>
        <button
          class="custom-button"
          onClick={() => {
            navigate("/patient_login");
          }}
        >
          Patient Login
        </button>
        <button
          class="custom-button"
          onClick={() => {
            navigate("/insurer_login");
          }}
        >
          Insurer Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
