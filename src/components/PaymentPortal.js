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
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white pt-20 pb-20 flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-3/4 bg-gray-900 p-8 rounded-lg shadow-lg border border-white"
      >
        <div className="mb-4">
          <label className="text-lg text-yellow-500 block mb-2">
            From Address
          </label>
          <input
            type="text"
            value={insurerAddr}
            readOnly
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-lg text-yellow-500 block mb-2">
            Patient Address
          </label>
          <input
            type="text"
            value={patientAddr}
            readOnly
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-lg text-yellow-500 block mb-2">
            Amount (eth)
          </label>
          <input
            type="number"
            value={amount}
            readOnly
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        <button
          type="submit"
          className="px-10 py-2 rounded-lg bg-teal-500 hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500"
        >
          Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentPortal;
