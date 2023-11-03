// src/ViewAppointments.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import DoctorAppointment from "../build/contracts/DoctorAppointment.json";

function ViewAppointments() {
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [appointments, setAppointments] = useState([]);
  const { address } = useParams();

  useEffect(() => {
    async function initializeWeb3() {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();

          const netId = await web3.eth.net.getId();
          const networkData = DoctorAppointment.networks[netId];
          if (networkData) {
            const bookingContract = new web3.eth.Contract(
              DoctorAppointment.abi,
              networkData.address
            );
            setContract(bookingContract);
            setWeb3Instance(web3);
          } else {
            console.error("Contract not deployed to detected network.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error(
          "Ethereum browser not detected. Consider installing MetaMask."
        );
      }
    }

    initializeWeb3();
  }, []);

  useEffect(() => {
    async function fetchAppointments() {
      if (contract && address) {
        const doctorAppointments = await contract.methods
          .getAppointmentsForDoctor(address)
          .call();
        setAppointments(doctorAppointments);
      }
    }

    fetchAppointments();
  }, [contract, address]);

  const removeAppointment = async (appointmentDate, appointmentTime) => {
    if (!contract || !web3Instance) return;
    try {
      await contract.methods
        .removeAppointment(address, appointmentDate, appointmentTime)
        .send({ from: address }); // Assuming the doctor is making this transaction
      alert("Appointment removed successfully!");
      const doctorAppointments = await contract.methods
        .getAppointmentsForDoctor(address)
        .call();
      setAppointments(doctorAppointments);
    } catch (error) {
      console.error("Error removing appointment:", error);
      alert("Failed to remove appointment.");
    }
  };

  return (
    <div className="viewappointments">
      <h1>View Appointments</h1>

      <h2>Appointments List:</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            Patient Name: {appointment.name}
            Date: {appointment.date}
            Time: {appointment.time}
            Patient: {appointment.patient}
            <button
              onClick={() =>
                removeAppointment(appointment.date, appointment.time)
              }
            >
              Remove Appointment
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewAppointments;
