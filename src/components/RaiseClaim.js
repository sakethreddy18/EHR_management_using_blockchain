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
  console.log("hi");

  const paid = "false";

  const processed = false;

  const [amount, setAmount] = useState(0);
  const { patient_addr } = useParams();

  const handleSubmit = async () => {
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
    <div>
      <h2>Raise a Claim</h2>
      <div>
        <label>Patient Name:</label>
        <input
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>
      <div>
        <label>Patient Address:</label>
        <input
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Insurer Address:</label>
        <input
          value={insurerAddress}
          onChange={(e) => setInsurerAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Plan:</label>
        <input value={plan} onChange={(e) => setPlan(e.target.value)} />
      </div>
      <div>
        <label>Document ID's:</label>
        <input
          value={documents}
          onChange={(e) => setDocuments(e.target.value)}
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default RaiseClaim;
