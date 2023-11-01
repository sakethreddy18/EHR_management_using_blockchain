import React, { useState } from "react";
import Web3 from "web3"; // Import the contract ABI
import { useNavigate, useParams } from "react-router";
import PatientRegistry from "../build/contracts/PatientRegistry.json";
import "../CSS/DoctorPermissionPage.css";

const DoctorPermissionPage = () => {
  const navigate = useNavigate();
  const address = useParams();
  const [patientAddress, setPatientAddress] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  const handleCheckPermission = async () => {
    try {
      const web3Instance = new Web3(window.ethereum);
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = PatientRegistry.networks[networkId];
      const contract = new web3Instance.eth.Contract(
        PatientRegistry.abi,
        deployedNetwork && deployedNetwork.address
      );
      const doctorAddress = address.address;
      const permission = await contract.methods
        .haspermission(patientAddress, doctorAddress)
        .call({ from: patientAddress });
      setHasPermission(permission);
      if (permission) {
        navigate("/doctor/" + doctorAddress + "/createehr"); // Navigate to the new page
      } else {
        alert("Dont have permission");
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      alert("An error occurred while checking permission.");
    }
  };

  return (
    <div className="doctorpermissionpage">
      <h2>Doctor Permission Page</h2>
      <div>
        <label>Patient Address:</label>
        <input
          type="text"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />
      </div>
      <button onClick={handleCheckPermission}>Check Permission</button>
      {hasPermission ? (
        <p>You have permission to create a health record. Navigating...</p>
      ) : (
        <p>You don't have permission to create a health record.</p>
      )}{" "}
    </div>
  );
};

export default DoctorPermissionPage;
