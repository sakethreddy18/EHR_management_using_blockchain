import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json"; // Import the contract ABI
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorLoginPage.css";

const DoctorLoginPage = () => {
  const navigate = useNavigate();
  const [doctorAddress, setDoctorAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  const handleCheckRegistration = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        DoctorRegistration.networks[networkId].address
      );

      const isRegisteredResult = await contract.methods
        .isRegisteredDoctor(doctorAddress)
        .call();
      setIsRegistered(isRegisteredResult);
      console.log(isRegistered);
      if (isRegisteredResult) {
        const doctor = await contract.methods
          .getDoctorDetails(doctorAddress)
          .call();
        setDoctorDetails(doctor);
        navigate("/doctor/" + doctorAddress);
      } else {
        alert("doctor not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  return (
    <div className="DoctorLoginPage">
      <h2>Doctor Login</h2>
      <div>
        <label>Doctor Address:</label>
        <input
          type="text"
          value={doctorAddress}
          onChange={(e) => setDoctorAddress(e.target.value)}
        />
      </div>
      <button onClick={handleCheckRegistration}>Check Registration</button>
      <div></div>
    </div>
  );
};

export default DoctorLoginPage;
