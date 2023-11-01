import PatientRegistry from "../build/contracts/PatientRegistry.json";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import "../CSS/PatientLogin.css";

const PatientLogin = () => {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await contract.methods
        .isRegisteredPatient(walletAddress)
        .call();
      if (!result) {
        alert("patient not registered");
        return;
      }
      console.log(walletAddress);
      setIsLoggedIn(result);
      navigate("/patient/" + walletAddress);
    } catch (error) {
      console.error("Error checking registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="patientlogin">
      <h1>Login Page</h1>
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
        <button onClick={handleLogin} disabled={!contract || isLoading}>
          Login
        </button>
      </div>
      <div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && isLoggedIn ? (
          <p>Welcome! You are logged in as a registered patient.</p>
        ) : (
          <p>Not registered or not logged in.</p>
        )}
      </div>
    </div>
  );
};

export default PatientLogin;
