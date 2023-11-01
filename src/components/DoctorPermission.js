import React, { useState, useEffect } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json"; // Replace with the correct path to your ABI JSON
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/DoctorPermission.css";

function DoctorPermission() {
  const { address } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientAddress, setPatientAddress] = useState("");
  const [doctorAddress, setDoctorAddress] = useState(address);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = record.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            record.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const checkPermission = async () => {
    try {
      setIsLoading(true);
      const isAuthorized = await contract.methods
        .canViewRecord(patientAddress, doctorAddress)
        .call({ from: doctorAddress });
      setIsAuthorized(isAuthorized);

      if (isAuthorized) {
        navigate("/doctor/" + doctorAddress + "/viewrec/" + patientAddress);
      } else {
        alert("Not Authorised");
        return;
      }
    } catch (error) {
      console.error("Error checking permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(doctorAddress);
  return (
    <div className="DoctorPermission">
      <h1>Doctor Permission</h1>
      <div>
        <label>
          Patient Address:
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Doctor Address:
          <input type="text" value={address} />
        </label>
      </div>
      <div>
        <button onClick={checkPermission} disabled={!contract || isLoading}>
          Check Permission
        </button>
      </div>
    </div>
  );
}

export default DoctorPermission;
