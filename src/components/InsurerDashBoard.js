import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const InsurerDashBoard = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div>Insurer dashboard</div>
      <p>Hello Insurer at address {address}</p>
      <button
        onClick={() => {
          navigate("/insurance_claims/" + address + "/processedClaims");
        }}
      >
        Processed Insurance claims
      </button>
      <button
        onClick={() => {
          navigate("/insurance_claims/" + address + "/unprocessedClaims");
        }}
      >
        Unprocessed Insurance claims
      </button>
    </div>
  );
};

export default InsurerDashBoard;
