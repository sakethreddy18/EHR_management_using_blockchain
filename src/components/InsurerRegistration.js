import React, { useState } from "react";
import Web3 from "web3";
import InsurerRegistry from "../build/contracts/InsurerRegistry.json";
import "../CSS/InsurerRegistration.css";

const InsurerRegistration = () => {
  const [insurerAddress, setInsurerAddress] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = async () => {
    if (
      !insurerAddress ||
      !insurerName ||
      !registrationNumber ||
      !officeAddress ||
      !phoneNumber
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
        InsurerRegistry.abi,
        InsurerRegistry.networks[networkId].address
      );

      const isRegIns = await contract.methods
        .isRegisteredInsurer(insurerAddress)
        .call();

      if (isRegIns) {
        alert("Insurer already exists");
        return;
      }

      await contract.methods
        .registerInsurer(
          insurerAddress,
          insurerName,
          registrationNumber,
          officeAddress,
          phoneNumber
        )
        .send({ from: insurerAddress });

      alert("Insurer registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the insurer.");
    }
  };

  return (
    <div className="register-insurer min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Insurer Registration
        </h2>
        <form className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="insurerAddress"
            >
              Insurer Address:
            </label>
            <input
              type="text"
              id="insurerAddress"
              name="insurerAddress"
              value={insurerAddress}
              onChange={(e) => setInsurerAddress(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="insurerName">
              Insurer Name:
            </label>
            <input
              type="text"
              id="insurerName"
              name="insurerName"
              value={insurerName}
              onChange={(e) => setInsurerName(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="registrationNumber"
            >
              Registration Number:
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="officeAddress"
            >
              Office Address:
            </label>
            <input
              type="text"
              id="officeAddress"
              name="officeAddress"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="phoneNumber">
              Phone Number:
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleRegister}
              className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 transition-colors duration-300 ease-in-out hover:bg-gray-400"
            >
              Register Insurer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsurerRegistration;
