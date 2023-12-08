import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// Add reference to a CSS file similar to PatientDashBoard

const InsurerDashBoard = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  const processedClaims = () => {
    navigate("/insurance_claims/" + address + "/processedClaims");
  };

  const unprocessedClaims = () => {
    navigate("/insurance_claims/" + address + "/unprocessedClaims");
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Insurer Dashboard</h2>
      <p className="text-xl sm:text-2xl mb-24">
        Hello, Insurer at address:{" "}
        <span className="font-bold text-yellow-500">{address}</span>
      </p>

      <div className="flex flex-wrap justify-center gap-5 w-full px-4 sm:px-0">
        <button
          onClick={processedClaims}
          className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 font-bold"
        >
          Processed Insurance Claims
        </button>
        <button
          onClick={unprocessedClaims}
          className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 font-bold"
        >
          Unprocessed Insurance Claims
        </button>
      </div>
    </div>
  );
};

export default InsurerDashBoard;
