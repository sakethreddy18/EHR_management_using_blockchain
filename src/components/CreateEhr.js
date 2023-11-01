import React, { useState, useEffect } from "react";
import record from "../build/contracts/record.json"; // Adjust the path as needed
import Web3 from "web3"; // Import Web3 here
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../CSS/CreateEhr.css";
import { Web3Storage } from "web3.storage";

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
    <div className="createehr">
      <h2>Create Electronic Health Record</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recordId">Record Id :</label>
          {recId}
        </div>
        <div>
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="doctorName">Doctor Name:</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="age">Patient Address</label>
          <input
            type="text"
            id="patientAddress"
            name="patientAddress"
            value={formData.patientAddress}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea
            type="textarea"
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="prescription">Prescription:</label>
          <textarea
            type="text"
            id="prescription"
            name="prescription"
            value={formData.prescription}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div>
          <h2>Upload Final Report</h2>
          <input type="file" onChange={onFileChange} ref={fileInputRef} />
        </div>
        <div>
          <label htmlFor="age">Doctor Private Key</label>
          <input
            type="text"
            id="doctorPrivateKey"
            name="doctorPrivateKey"
            value={formData.doctorPrivateKey}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Record</button>
      </form>
    </div>
  );
};

export default CreateEhr;
