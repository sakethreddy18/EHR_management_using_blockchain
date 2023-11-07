import React, { useState } from "react";
import Web3 from "web3";
import InsurerRegistry from "../build/contracts/InsurerRegistry.json"; // Import the contract ABI
import { useNavigate } from "react-router-dom";

const InsurerLoginPage = () => {
  const navigate = useNavigate();
  const [insurerAddress, setInsurerAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [insurerDetails, setInsurerDetails] = useState(null);

  const handleCheckRegistration = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        InsurerRegistry.abi,
        InsurerRegistry.networks[networkId].address
      );

      const isRegisteredResult = await contract.methods
        .isRegisteredInsurer(insurerAddress)
        .call();
      setIsRegistered(isRegisteredResult);

      if (isRegisteredResult) {
        const insurer = await contract.methods
          .getInsurerDetails(insurerAddress)
          .call();
        setInsurerDetails(insurer);
        navigate("/insurer/" + insurerAddress);
      } else {
        alert("Insurer not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Insurer Login</h2>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Insurer Address:</label>
          <input
            type="text"
            value={insurerAddress}
            onChange={(e) => setInsurerAddress(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            required
          />
        </div>
        <button
          onClick={handleCheckRegistration}
          className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
        >
          Check Registration
        </button>
      </div>
    </div>
  );
};

export default InsurerLoginPage;
