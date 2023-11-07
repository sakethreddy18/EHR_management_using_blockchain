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
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white pt-20 pb-20 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Record Viewer</h1>

      <h2 className="mb-4 text-2xl text-center">All Records:</h2>

      <ul className="w-full sm:w-3/4 list-decimal list-inside bg-gray-900 p-8 rounded-lg shadow-lg">
        {records.map((record, index) => (
          <li
            key={index}
            className="mb-8 p-4 border-b border-gray-700 border-4 border-white rounded-lg"
          >
            <strong className="text-lg text-yellow-500">Record Id:</strong>{" "}
            {record.recordId}
            <br />
            <strong className="text-lg text-yellow-500">
              Patient Name:
            </strong>{" "}
            {record.patientName}
            <br />
            <strong className="text-lg text-yellow-500">
              Doctor Name:
            </strong>{" "}
            {record.doctorName}
            <br />
            <strong className="text-lg text-yellow-500">
              Doctor Address:
            </strong>{" "}
            {record.doctorAddress}
            <br />
            <strong className="text-lg text-yellow-500">Age:</strong>{" "}
            {record.age}
            <br />
            <strong className="text-lg text-yellow-500">Gender:</strong>{" "}
            {record.gender}
            <br />
            <strong className="text-lg text-yellow-500">Diagnosis:</strong>{" "}
            {record.diagnosis}
            <br />
            <strong className="text-lg text-yellow-500">
              Prescription:
            </strong>{" "}
            {record.prescription}
            <br />
            <strong className="text-lg text-yellow-500">
              Verification:
            </strong>{" "}
            {hookVerified[index] || "Not Verified"}
            <br />
            <div className="flex flex-col mt-4">
              <h2 className="mb-2 text-xl text-yellow-500 text-center">
                Retrieve & View
              </h2>
              <button
                onClick={() => retrieveFromWeb3(record.cid)}
                className="mb-2 px-10 py-2 rounded-lg bg-teal-500 hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500"
              >
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
                className="mb-2 px-10 py-2 rounded-lg bg-teal-500 hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500"
              >
                Verify
              </button>
              {urlMap[record.cid] && (
                <div
                  className="border border-gray-600 mt-4 rounded-lg overflow-hidden"
                  style={{ width: "100%", height: "400px" }}
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsurerViewRecords;
