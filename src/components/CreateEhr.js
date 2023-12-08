import React, { useState, useEffect } from "react";
import record from "../build/contracts/record.json"; // Adjust the path as needed
import Web3 from "web3"; // Import Web3 here
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../big_css/CreateEHR.css";
import { Web3Storage } from "web3.storage";
import { render, fireEvent, waitFor } from "@testing-library/react";

const CreateEhr = () => {
  const { address } = useParams(); // Retrieve account address from URL
  const [web3Instance, setWeb3Instance] = useState(null);
  const [recId, setRecId] = useState("EHR" + uuidv4());
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    patientAddress: "",
    age: "",
    gender: "",
    diagnosis: "",
    prescription: "",
    doctorPrivateKey: "",
  });
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState(null);
  const [retrievedFileURL, setRetrievedFileURL] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgyNDdFZDdiNGU5OWU2NGNjRUVGMjczOERBYzREQzNkRUM4YTJkZTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTgyMjg0OTIyMzQsIm5hbWUiOiJpcGZzX3Rlc3RpbmcifQ.fY8HvEANqxvUv56pGyUqVU1X7PDRLsV6FN22eamNlmo",
  });

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const retrieveFromWeb3 = async () => {
    if (!cid) return;

    const retrieved = await client.get(cid);
    if (!retrieved) {
      console.error("Failed to retrieve file");
      return;
    }

    const fileBlob = new Blob([await retrieved.arrayBuffer()], {
      type: "application/pdf",
    });
    const fileURL = URL.createObjectURL(fileBlob);
    setRetrievedFileURL(fileURL);
  };

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request account access
        setWeb3Instance(web3Instance);
      } else {
        console.error("MetaMask not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = record.networks[networkId];
      if (!deployedNetwork) {
        throw new Error("Contract not deployed to this network");
      }
      if (!file) {
        alert("file not uploaded");
        return;
      }

      const cid = await client.put([file]);
      setCid(cid);
      alert("file uploaded successfully with " + cid);
      const temp_docSignature = web3Instance.eth.accounts.sign(
        cid,
        formData.doctorPrivateKey
      );

      const docSignature = temp_docSignature.signature;

      const contract = new web3Instance.eth.Contract(
        record.abi,
        deployedNetwork.address
      );
      await contract.methods
        .createEHR(
          recId,
          formData.patientName,
          formData.doctorName,
          address, // Use account address from URL
          formData.patientAddress,
          parseInt(formData.age),
          formData.gender,
          formData.diagnosis,
          formData.prescription,
          cid,
          docSignature
        )
        .send({ from: formData.patientAddress });

      console.log("EHR created successfully.");
      // Reset the form fields
      setFormData({
        recordId: "",
        patientName: "",
        doctorName: "",
        patientAddress: "",
        age: "",
        gender: "",
        diagnosis: "",
        prescription: "",
        doctorPrivateKey: "",
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // This will reset the file input
      }
      const newRecId = "EHR" + uuidv4();
      setRecId(newRecId);
    } catch (error) {
      console.error("EHR creation failed:", error);
    }
  };

  return (
    <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Create Electronic Health Record
        </h2>
        <form
          className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-white" htmlFor="recordId">
              Record Id :
            </label>
            <span className="mt-2 p-2 text-white font-bold">{recId}</span>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="patientName">
              Patient Name:
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="doctorName">
              Doctor Name:
            </label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
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
              type="text"
              id="patientAddress"
              name="patientAddress"
              value={formData.patientAddress}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="age">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="gender">
              Gender:
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="diagnosis">
              Diagnosis:
            </label>
            <textarea
              type="textarea"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white h-24 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="prescription"
            >
              Prescription:
            </label>
            <textarea
              type="text"
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full h-24 text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            ></textarea>
          </div>

          <div className="mb-4 col-span-full">
            <h2 className="text-white">Upload Final Report</h2>
            <input
              type="file"
              onChange={onFileChange}
              ref={fileInputRef}
              className="mt-2 p-2 text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4 col-span-full">
            <label
              className="block font-bold text-white"
              htmlFor="doctorPrivateKey"
            >
              Doctor Private Key:
            </label>
            <input
              type="text"
              id="doctorPrivateKey"
              name="doctorPrivateKey"
              value={formData.doctorPrivateKey}
              onChange={handleInputChange}
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-background-color duration-300 ease-in hover:bg-gray-400 transform hover:scale-105"
            >
              Create Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEhr;
