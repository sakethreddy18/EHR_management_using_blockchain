import React, { useState, useEffect } from "react";
import Web3 from "web3";
import InsuranceClaims from "../build/contracts/InsuranceClaims.json";
import { useParams } from "react-router-dom";

const PatientViewClaims = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [claims, setClaims] = useState([]);
  const { address } = useParams();
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

  const fetchClaims = async () => {
    if (contract && insurerAddress) {
      try {
        const insurerClaims = await contract.methods
          .getClaims()
          .call({ from: insurerAddress });

        const patientClaims = insurerClaims.filter(
          (claim) => claim.patientAddress === address
        );
        setClaims(patientClaims);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white pt-20 pb-20 flex flex-col justify-center items-center">
      <h2 className="text-4xl font-bold mb-8">Claims</h2>

      <div className="flex flex-col w-full sm:w-1/2 mb-6">
        <label className="mb-2 text-lg text-yellow">
          Insurer Address:
          <input
            type="text"
            onChange={(e) => setInsurerAddress(e.target.value)}
            className="p-2 mt-1 w-full rounded-lg bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200 placeholder-white focus:outline-none focus:border-teal-500 border-2 border-transparent"
          />
        </label>
      </div>

      <button
        onClick={fetchClaims}
        className="mb-8 px-10 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        Fetch Claims
      </button>

      <ul className="w-full sm:w-2/3 list-decimal list-inside bg-gray-900 p-6 rounded-lg shadow-lg">
        {claims.map((claim, index) => (
          <li key={index} className="mb-6 p-2 border-b border-gray-700">
            <strong className="text-lg text-yellow-500">Claim ID:</strong>{" "}
            {claim.claimid}
            <br />
            <strong className="text-lg text-yellow-500">
              Patient Name:
            </strong>{" "}
            {claim.patientName}
            <br />
            <strong className="text-lg text-yellow-500">
              Patient Address:
            </strong>{" "}
            {claim.patientAddress}
            <br />
            <strong className="text-lg text-yellow-500">
              Insurer Address:
            </strong>{" "}
            {claim.InsurerAddress}
            <br />
            <strong className="text-lg text-yellow-500">
              Plan Opted:
            </strong>{" "}
            {claim.plan}
            <br />
            <strong className="text-lg text-yellow-500">
              Documents Applied:
            </strong>{" "}
            {claim.documents}
            <br />
            <strong className="text-lg text-yellow-500">
              Amount Applied:
            </strong>{" "}
            {claim.amount}
            <br />
            <strong className="text-lg text-yellow-500">Processed:</strong>{" "}
            {String(claim.processed)}
            <br />
            <strong className="text-lg text-yellow-500">Paid:</strong>{" "}
            {claim.paid}
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientViewClaims;
