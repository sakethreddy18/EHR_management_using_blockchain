import React, { useEffect, useState } from "react";
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
    <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
      <h1 className="text-4xl font-bold text-center mb-10">
        View Appointments
      </h1>

      <h2 className="text-2xl">Appointments List:</h2>
      <ul className="list-disc ml-5">
        {appointments.map((appointment, index) => (
          <li
            key={index}
            className="flex justify-between items-start border-white border p-5 mb-5 flex-wrap"
          >
            <div>
              <span className="text-yellow-500">Patient Name: </span>
              {appointment.name}
            </div>
            <div>
              <span className="text-yellow-500">Date: </span>
              {appointment.date}
            </div>
            <div>
              <span className="text-yellow-500">Time: </span>
              {appointment.time}
            </div>
            <div>
              <span className="text-yellow-500">Patient: </span>
              {appointment.patient}
            </div>
            <button
              onClick={() =>
                removeAppointment(appointment.date, appointment.time)
              }
              className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-gray-600 hover:scale-105"
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
