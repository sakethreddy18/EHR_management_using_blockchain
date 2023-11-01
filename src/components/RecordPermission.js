import React, { useState, useEffect } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json"; // Replace with the correct path to your ABI JSON
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import "../CSS/RecordPermission.css";
import { useParams } from "react-router-dom";

function RecordPermission() {
  const { address } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractInstance2, setContractInstance2] = useState(null);
  const [patientAddress, setPatientAddress] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = record.networks[networkId];
          const deployedNetwork2 = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            record.abi,
            deployedNetwork && deployedNetwork.address
          );

          const contractInstance2 = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork2 && deployedNetwork2.address
          );

          setContract(contractInstance);
          setContractInstance2(contractInstance2);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const grantPermission = async () => {
    try {
      setIsLoading(true);
      await contract.methods
        .grantPermission(doctorAddress)
        .send({ from: patientAddress });
      setPermissionGranted(true);
    } catch (error) {
      console.error("Error granting permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const revokePermission = async () => {
    try {
      setIsLoading(true);
      await contract.methods
        .revokePermission(doctorAddress)
        .send({ from: patientAddress });
      setPermissionGranted(false);
    } catch (error) {
      console.error("Error revoking permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recordpermission">
      <h1>Record Permission</h1>
      <div>
        <label>
          Patient Address:
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Doctor Address:
          <input
            type="text"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={grantPermission} disabled={!contract || isLoading}>
          Grant Permission
        </button>
        <button onClick={revokePermission}>Revoke Permission</button>
      </div>
    </div>
  );
}

export default RecordPermission;
