import React, { useState, useEffect } from "react";
import Web3 from "web3";
import InsuranceClaims from "../build/contracts/InsuranceClaims.json";
import {
  useParams,
  useNavigate,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
const PatientViewClaims = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [recContract, setRecContract] = useState(null);
  const [claims, setClaims] = useState([]);
  const { address } = useParams(); // This is the insurer's address passed from the URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [insurerAddress, setInsurerAddress] = useState("");

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable(); // Request account access

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = InsuranceClaims.networks[networkId];
          if (deployedNetwork) {
            const contractInstance = new web3Instance.eth.Contract(
              InsuranceClaims.abi,
              deployedNetwork.address
            );
            setWeb3(web3Instance);
            setContract(contractInstance);
          } else {
            console.error("Contract not found on the network");
          }
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    const fetchClaims = async () => {
      if (contract) {
        try {
          const insurerClaims = await contract.methods
            .getClaims()
            .call({ from: insurerAddress });

          // Filter the claims where processed is true
          const patientClaims = insurerClaims.filter(
            (claim) => claim.patientAddress === address
          );
          setClaims(patientClaims);
        } catch (error) {
          console.error("Error fetching claims:", error);
        }
      }
    };

    fetchClaims();
  }, [contract, insurerAddress]);

  return (
    <div>
      <h2>Claims</h2>
      <label> Insurer Address </label>
      <input type="text" onChange={(e) => setInsurerAddress(e.target.value)} />

      <ul>
        {claims.map((claim, index) => (
          <li key={index}>
            <strong>Claim ID:</strong> {claim.claimid}
            <br />
            <strong>Patient Name:</strong> {claim.patientName}
            <br />
            <strong>Patient Address:</strong> {claim.patientAddress}
            <br />
            <strong>Insurer Address:</strong> {claim.InsurerAddress}
            <br />
            <strong>Plan Opted:</strong> {claim.plan}
            <br />
            <strong>Documents Applied:</strong> {claim.documents}
            <br />
            <strong>Amount Applied:</strong> {claim.amount}
            <br />
            <strong>Processed:</strong> {String(claim.processed)}
            <br />
            <strong>Paid:</strong> {claim.paid}
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientViewClaims;
