import React, { useState } from "react";
import Web3 from "web3";
import { v4 as uuidv4 } from "uuid";
import { useParams, Link, useNavigate } from "react-router-dom";
import InsuranceClaims from "../build/contracts/InsuranceClaims.json";
function RaiseClaim({ contract }) {
  const [insurerAddress, setInsurerAddress] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientName, setPatientName] = useState("");
  const [plan, setPlan] = useState("");
  const [claimId, setClaimId] = useState("CID" + uuidv4());

  const [documents, setDocuments] = useState("");

  const paid = "false";

  const processed = false;

  const [amount, setAmount] = useState(0);
  const { patient_addr } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        InsuranceClaims.abi,
        InsuranceClaims.networks[networkId].address
      );

      await contract.methods
        .createClaim(
          claimId,
          patientName,
          patientAddress,
          insurerAddress,
          plan,
          documents,
          amount,
          processed,
          paid
        )
        .send({ from: patientAddress });
      alert("Claim raised successfully");
      const newCid = "CID" + uuidv4();
      setClaimId(newCid);
    } catch (error) {
      console.error("Error raising claim:", error);
    }
  };

  return (
    <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-6xl ">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Raise a Claim
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="patientName">
              Patient Name:
            </label>
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="patientAddress"
            >
              Patient Address:
            </label>
            <input
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="insurerAddress"
            >
              Insurer Address:
            </label>
            <input
              value={insurerAddress}
              onChange={(e) => setInsurerAddress(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="plan">
              Plan:
            </label>
            <input
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="documents">
              Document ID's:
            </label>
            <input
              value={documents}
              onChange={(e) => setDocuments(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="amount">
              Amount:
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-500 text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-colors duration-300 ease-in hover:bg-teal-500 active:bg-gray-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RaiseClaim;
