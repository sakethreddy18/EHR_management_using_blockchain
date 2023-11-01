import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json"; // Import the contract ABI
import "../CSS/DoctorRegistration.css";
const DoctorRegistrationForm = () => {
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");

  const handleRegister = async () => {
    if (
      !doctorAddress ||
      !doctorName ||
      !hospitalName ||
      !dateOfBirth ||
      !gender ||
      !phoneNumber ||
      !specialization ||
      !department ||
      !designation ||
      !workExperience
    ) {
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    if (phoneNumber.length !== 10) {
      alert(
        "You have entered a wrong phone number. Please enter a 10-digit phone number."
      );
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        DoctorRegistration.networks[networkId].address
      );
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log(web3);

      // Check if dateOfBirth is in the format dd/mm/yyyy
      const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (!datePattern.test(dateOfBirth)) {
        alert("Please enter Date of Birth in the format dd/mm/yyyy");
        return;
      }
      const isRegDoc = await contract.methods
        .isRegisteredDoctor(doctorAddress)
        .call();

      if (isRegDoc) {
        alert("Doctor already exsists");
        return;
      }
      await contract.methods
        .registerDoctor(
          doctorAddress,
          doctorName,
          hospitalName,
          dateOfBirth,
          gender,
          phoneNumber,
          specialization,
          department,
          designation,
          workExperience
        )
        .send({ from: doctorAddress });
      alert("Doctor registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error");
    }
  };

  return (
    <div className="DoctorRegistrationForm">
      <h2>Doctor Registration Form123123</h2>
      <div>
        <label>Doctor Address:</label>
        <input
          type="text"
          value={doctorAddress}
          onChange={(e) => setDoctorAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Doctor Name:</label>
        <input
          type="text"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
      </div>
      <div>
        <label>Hospital Name:</label>
        <input
          type="text"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="text"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <label>Gender:</label>
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Specialization:</label>
        <input
          type="text"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
      </div>
      <div>
        <label>Department:</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div>
        <label>Designation:</label>
        <input
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
      </div>
      <div>
        <label>Work Experience:</label>
        <input
          type="text"
          value={workExperience}
          onChange={(e) => setWorkExperience(e.target.value)}
        />
      </div>
      <button onClick={handleRegister}>Register Doctor</button>
    </div>
  );
};

export default DoctorRegistrationForm;
