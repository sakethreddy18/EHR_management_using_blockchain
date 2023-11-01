// src/RecordViewer.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json"; // Replace with the correct path to your ABI JSON
import { useParams } from "react-router-dom";
import "../CSS/ContractInteraction.css";
import { Web3Storage } from "web3.storage";

function ContractInteraction() {
  const { address } = useParams();
  const [records, setRecords] = useState([]);
  const [urlMap, setUrlMap] = useState({}); // This will map cids to URLs

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
            .call({ from: address });

          setRecords(fetchedRecords);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("Please install MetaMask extension.");
      }
    }

    fetchRecords();
  }, [address]);

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
              <section>
                <h2>Retrieve & View</h2>
                <button onClick={() => retrieveFromWeb3(record.cid)}>
                  Retrieve from Web3.Storage
                </button>

                {/* Check if we have a URL for this CID */}
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

export default ContractInteraction;
