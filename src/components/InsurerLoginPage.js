import React, { useState } from "react";
import Web3 from "web3";
import InsurerRegistry from "../build/contracts/InsurerRegistry.json"; // Import the contract ABI
import { useNavigate } from "react-router-dom";
import "../CSS/InsurerLoginPage.css";

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
    <div className="InsurerLoginPage">
      <h2>Insurer Login</h2>
      <div>
        <label>Insurer Address:</label>
        <input
          type="text"
          value={insurerAddress}
          onChange={(e) => setInsurerAddress(e.target.value)}
        />
      </div>
      <button onClick={handleCheckRegistration}>Check Registration</button>
    </div>
  );
};

export default InsurerLoginPage;
