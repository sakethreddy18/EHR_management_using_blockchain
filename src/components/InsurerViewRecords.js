// src/RecordViewer.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json"; // Replace with the correct path to your ABI JSON
import { useParams } from "react-router-dom";
import "../CSS/ContractInteraction.css";
import { Web3Storage } from "web3.storage";

function InsurerViewRecords() {
  const { pa } = useParams();
  const [records, setRecords] = useState([]);
  const [urlMap, setUrlMap] = useState({}); // This will map cids to URLs
  const verified = [];
  const [hookVerified, setHookVerified] = useState(
    records.map(() => "Not Verified")
  );

  useEffect(() => {
    async function fetchRecords() {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = record.networks[networkId];
          const contractAddress = deployedNetwork.address;
          const recordContract = new web3.eth.Contract(
            record.abi,
            contractAddress
          );

          const fetchedRecords = await recordContract.methods
            .getRecords()
            .call({ from: pa });

          setRecords(fetchedRecords);
          setHookVerified(fetchedRecords.map(() => "Not Verified"));
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("Please install MetaMask extension.");
      }
    }

    fetchRecords();
  }, [pa]);

  const retrieveFromWeb3 = async (recordCid) => {
    const client = new Web3Storage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgyNDdFZDdiNGU5OWU2NGNjRUVGMjczOERBYzREQzNkRUM4YTJkZTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTgyMjg0OTIyMzQsIm5hbWUiOiJpcGZzX3Rlc3RpbmcifQ.fY8HvEANqxvUv56pGyUqVU1X7PDRLsV6FN22eamNlmo",
    });

    const retrieved = await client.get(recordCid);
    if (!retrieved) {
      console.error("Failed to retrieve file");
      return;
    }

    const fileBlob = new Blob([await retrieved.arrayBuffer()], {
      type: "application/pdf",
    });
    const fileURL = URL.createObjectURL(fileBlob);

    setUrlMap((prevMap) => ({ ...prevMap, [recordCid]: fileURL })); // Add the new URL to the map
  };

  const verifyDocument = async (e_cid, e_docAddr, e_docSig, e_index) => {
    const web3 = new Web3(window.ethereum);

    const actualSignature = web3.eth.accounts.recover(e_cid, e_docSig);

    let updatedVerificationStatus = [...hookVerified]; // Copy the existing status array

    if (actualSignature === e_docAddr) {
      updatedVerificationStatus[e_index] = "Verified";
      alert(
        "Retrieved address : " +
          actualSignature +
          "\n" +
          "EHR Doctor Address : " +
          e_docAddr +
          "\n" +
          "Addresses match hence verified"
      );
    } else {
      updatedVerificationStatus[e_index] = "Verification Failed";
      alert(
        "Retrieved address : " +
          actualSignature +
          "\n" +
          "EHR Doctor Address : " +
          e_docAddr +
          "\n" +
          "Addresses do not match hence verification failed"
      );
    }
    setHookVerified(updatedVerificationStatus); // Update the verification status
  };

  return (
    <div className="contractinteraction">
      <h1>Record Viewer</h1>
      <div>
        <h2>All Records:</h2>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              <strong>Record Id: {record.recordId}</strong>
              <br />
              Patient Name: {record.patientName}
              <br />
              Doctor Name: {record.doctorName}
              <br />
              Doctor Address: {record.doctorAddress}
              <br />
              Age: {record.age}
              <br />
              Gender: {record.gender}
              <br />
              Diagnosis: {record.diagnosis}
              <br />
              Prescription: {record.prescription}
              <br />
              Verification: {hookVerified[index] || "Not Verified"}
              <br />
              <section>
                <h2>Retrieve & View</h2>
                <button onClick={() => retrieveFromWeb3(record.cid)}>
                  Retrieve from Web3.Storage
                </button>
                <button
                  onClick={() =>
                    verifyDocument(
                      record.cid,
                      record.doctorAddress,
                      record.docSignature,
                      index
                    )
                  }
                >
                  Verify
                </button>
                {urlMap[record.cid] && (
                  <div
                    style={{
                      border: "1px solid black",
                      marginTop: "20px",
                      width: "100%",
                      height: "400px",
                      overflow: "hidden",
                    }}
                  >
                    <embed
                      src={urlMap[record.cid]}
                      type="application/pdf"
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                )}
              </section>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InsurerViewRecords;
