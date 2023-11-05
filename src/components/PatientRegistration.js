import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistry from "../build/contracts/PatientRegistry.json";
import "../CSS/PatientRegistration.css";
const PatientRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistry.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistry.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const handleRegister = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          if (isRegistered) {
            alert("User is already registered.");
            return;
          }
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistry.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistry.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }

      if (
        !name ||
        !dateOfBirth ||
        !dateOfBirth ||
        !gender ||
        !phoneNumber ||
        !homeAddress ||
        !walletAddress
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

      const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (!datePattern.test(dateOfBirth)) {
        alert("Please enter Date of Birth in the format dd/mm/yyyy");
        return;
      }

      setIsLoading(true);
      const isRegPatient = await contract.methods
        .isRegisteredPatient(walletAddress)
        .call({ from: walletAddress });

      if (isRegPatient) {
        setIsRegistered(true); // Set isRegistered to true if registered
        alert("User is already registered.");
        setIsLoading(false);
        return;
      }

      await contract.methods.registerPatient;

      await contract.methods
        .registerPatient(
          name,
          dateOfBirth,
          homeAddress,
          phoneNumber,
          walletAddress,
          gender
        )
        .send({ from: walletAddress });
      setName("");
      setHomeAddress("");
      setDateOfBirth("");
      setPhoneNumber("");
      setWalletAddress("");
      setGender("");
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="patientRegistration">
      <h1>Register Patient</h1>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Date of Birth:
          <input
            type="text"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Home Address:
          <input
            type="text"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Wallet Address:
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Gender:
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleRegister} disabled={!contract || isLoading}>
          Register
        </button>
      </div>
    </div>
  );
};

export default PatientRegistration;
