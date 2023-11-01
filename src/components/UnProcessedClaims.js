import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  useParams,
  useNavigate,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import InsuranceClaims from "../build/contracts/InsuranceClaims.json"; // Adjust the path as needed
import record from "../build/contracts/record.json";
import InsurerViewRecords from "./InsurerViewRecords";

const UnProcessedClaims = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [recContract, setRecContract] = useState(null);
  const [claims, setClaims] = useState([]);
  const { address } = useParams(); // This is the insurer's address passed from the URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable(); // Request account access

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = InsuranceClaims.networks[networkId];
          const deployedNetwork2 = record.networks[networkId];
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

          if (deployedNetwork2) {
            const contractInstance2 = new web3Instance.eth.Contract(
              record.abi,
              deployedNetwork2.address
            );

            setRecContract(contractInstance2);
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
            .call({ from: address });

          // Filter the claims where processed is true
          const UnProcessedClaims = insurerClaims.filter(
            (claim) => !claim.processed
          );
          setClaims(UnProcessedClaims);
        } catch (error) {
          console.error("Error fetching claims:", error);
        }
      }
    };

    fetchClaims();
  }, [contract, address]);

  const viewDocPermission = async (pa) => {
    try {
      const isAuthorized = await recContract.methods
        .canViewRecord(pa, address)
        .call({ from: address });
      setIsAuthorized(isAuthorized);

      if (!isAuthorized) {
        alert("You do not have permission");
      } else {
        navigate("/insurance_claims/insurance_view_rec/" + pa);
      }
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  const acceptClaim = async (e_claimId, e_fromAddr, e_toAddr, e_amount) => {
    if (contract) {
      try {
        await contract.methods
          .changeProcessed(e_claimId, true)
          .send({ from: address });

        const insurerClaims = await contract.methods
          .getClaims()
          .call({ from: address });

        // Filter the claims where processed is true
        const UnProcessedClaims2 = insurerClaims.filter(
          (claim) => !claim.processed
        );
        setClaims(UnProcessedClaims2);

        // Filter the claims where processed is true
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    }
  };

  const rejectClaim = async (e_claimId) => {
    if (contract) {
      try {
        await contract.methods
          .changeProcessed(e_claimId, true)
          .send({ from: address });

        await contract.methods
          .changePaid(e_claimId, "Rejected")
          .send({ from: address });

        const insurerClaims = await contract.methods
          .getClaims()
          .call({ from: address });

        // Filter the claims where processed is true
        const UnProcessedClaims2 = insurerClaims.filter(
          (claim) => !claim.processed
        );
        setClaims(UnProcessedClaims2);

        // Filter the claims where processed is true
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    }
  };

  return (
    <div>
      <h2>Claims</h2>
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
            <button onClick={() => viewDocPermission(claim.patientAddress)}>
              {" "}
              View Documents
            </button>
            <button
              onClick={() =>
                acceptClaim(
                  claim.claimid,
                  claim.InsurerAddress,
                  claim.patientAddress,
                  claim.amount
                )
              }
            >
              {" "}
              Accept
            </button>
            <button onClick={() => rejectClaim(claim.claimid)}> Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnProcessedClaims;
