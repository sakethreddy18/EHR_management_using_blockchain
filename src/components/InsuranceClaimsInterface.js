import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import InsuranceClaims from "../build/contracts/InsuranceClaims.json"; // Adjust the path as needed

const InsuranceClaimsInterface = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [claims, setClaims] = useState([]);
  const { address } = useParams(); // This is the insurer's address passed from the URL
  const navigate = useNavigate();

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
            .call({ from: address });

          // Filter the claims where processed is true
          const processedClaims = insurerClaims.filter(
            (claim) => claim.processed
          );
          setClaims(processedClaims);
        } catch (error) {
          console.error("Error fetching claims:", error);
        }
      }
    };

    fetchClaims();
  }, [contract, address]);

  const handlePayment = (e_insurerAddr, e_patientAddr, e_amount, e_claimId) => {
    navigate(
      "/insurance_claims/" + e_insurerAddr + "/processedClaims/paymentPortal",
      {
        state: {
          insurerAddr: e_insurerAddr,
          patientAddr: e_patientAddr,
          amount: e_amount,
          claimId: e_claimId,
        },
      }
    );
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
            <strong>Paid:</strong> {String(claim.paid)}
            <br />
            {claim.paid === "false" && (
              <button
                onClick={() =>
                  handlePayment(
                    claim.InsurerAddress,
                    claim.patientAddress,
                    claim.amount,
                    claim.claimid
                  )
                }
              >
                Payment
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsuranceClaimsInterface;
