import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import InsuranceClaims from "../build/contracts/InsuranceClaims.json";

const PaymentPortal = () => {
  const location = useLocation();
  const { insurerAddr, patientAddr, amount, claimId } = location.state;
  const [contract, setContract] = useState(null);
  const [claims, setClaims] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = InsuranceClaims.networks[networkId];

          if (deployedNetwork) {
            const contractInstance = new web3Instance.eth.Contract(
              InsuranceClaims.abi,
              deployedNetwork.address
            );

            setWeb3(web3Instance);
            setContract(contractInstance);
          } else {
            console.error("Contract not found on the network");
          }
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);
  useEffect(() => {
    const fetchClaims = async () => {
      if (contract) {
        try {
          const insurerClaims = await contract.methods
            .getClaims()
            .call({ from: insurerAddr });

          // Filter the claims where processed is true
          const processedClaims = insurerClaims.filter(
            (claim) => claim.processed
          );
          setClaims(processedClaims);
        } catch (error) {
          console.error("Error fetching claims:", error);
        }
      }
    };

    fetchClaims();
  }, [contract, insurerAddr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fromAddress = insurerAddr;
    const toAddress = patientAddr;
    const etherAmount = web3.utils.toWei(amount.toString(), "ether");

    try {
      await web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: etherAmount,
      });

      await contract.methods
        .changePaid(claimId, "paid")
        .send({ from: insurerAddr });

      alert("Payment Successful");
    } catch (error) {
      console.error("Error sending payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>From Address</label>
          <input type="text" value={insurerAddr} readOnly />
        </div>

        <div>
          <label>Patient Address</label>
          <input type="text" value={patientAddr} readOnly />
        </div>

        <div>
          <label> Amount (eth)</label>
          <input type="number" value={amount} readOnly />
        </div>

        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default PaymentPortal;
