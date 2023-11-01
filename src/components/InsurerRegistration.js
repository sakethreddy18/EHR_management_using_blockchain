import React, { useState } from "react";
import Web3 from "web3";
import InsurerRegistry from "../build/contracts/InsurerRegistry.json"; // Import the contract ABI
import "../CSS/InsurerRegistration.css";
const InsurerRegistration = () => {
  const [insurerAddress, setInsurerAddress] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = async () => {
    if (
      !insurerAddress ||
      !insurerName ||
      !registrationNumber ||
      !officeAddress ||
      !phoneNumber
    ) {
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    if (phoneNumber.length !== 10) {
      alert(
        "You have entered a wrong phone number. Please enter a 10-digit phone number."
      );
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        InsurerRegistry.abi,
        InsurerRegistry.networks[networkId].address
      );

      const isRegIns = await contract.methods
        .isRegisteredInsurer(insurerAddress)
        .call();

      if (isRegIns) {
        alert("Insurer already exsists");
        return;
      }

      await contract.methods
        .registerInsurer(
          insurerAddress,
          insurerName,
          registrationNumber,
          officeAddress,
          phoneNumber
        )
        .send({ from: insurerAddress });

      alert("Insurer registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the insurer.");
    }
  };

  return (
    <div className="InsurerRegistration">
      <h2>Insurer Registration</h2>
      <div>
        <label>Insurer Address:</label>
        <input
          type="text"
          value={insurerAddress}
          onChange={(e) => setInsurerAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Insurer Name:</label>
        <input
          type="text"
          value={insurerName}
          onChange={(e) => setInsurerName(e.target.value)}
        />
      </div>
      <div>
        <label>Registration Number:</label>
        <input
          type="text"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Office Address:</label>
        <input
          type="text"
          value={officeAddress}
          onChange={(e) => setOfficeAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <button onClick={handleRegister}>Register Insurer</button>
    </div>
  );
};

export default InsurerRegistration;
