// src/BookAppointment.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DoctorAppointment from "../build/contracts/DoctorAppointment.json"; // Replace with the correct path to your ABI JSON for booking
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookAppointment() {
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const [doctorAddress, setDoctorAddress] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // This stores the full date and time
  const [dateOnly, setDateOnly] = useState(""); // This will store only the date in "YYYY-MM-DD" format
  const [timeOnly, setTimeOnly] = useState(0);

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
            const fetchedAccounts = await web3.eth.getAccounts();
            setAccounts(fetchedAccounts);
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
    // Extracting date components
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    setDateOnly(`${yyyy}-${mm}-${dd}`);

    // Extracting time components
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    setTimeOnly(hours * 100 + minutes);
  }, [selectedDate]);

  useEffect(() => {
    async function fetchBookedSlots() {
      if (contract && doctorAddress && dateOnly) {
        const slots = await contract.methods
          .getBookedSlotsForDoctor(doctorAddress, dateOnly)
          .call();
        setBookedSlots(slots);
      }
    }

    fetchBookedSlots();
  }, [contract, doctorAddress, dateOnly]);

  const handleBooking = async () => {
    if (!contract || !accounts.length) return;

    try {
      await contract.methods
        .bookAppointment(
          doctorAddress,
          dateOnly,
          timeOnly,
          patientAddress,
          patientName
        )
        .send({ from: patientAddress });
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  return (
    <div className="bookappointment">
      <h1>Book Appointment</h1>

      <div>
        <label>Patient Name</label>
        <input type="text" onChange={(e) => setPatientName(e.target.value)} />
        <label>Doctor Address:</label>
        <input
          type="text"
          value={doctorAddress}
          onChange={(e) => setDoctorAddress(e.target.value)}
        />

        <label>Patient Address:</label>
        <input
          type="text"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />

        <label>Date and Time:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          excludeTimes={bookedSlots.map((slot) => {
            const hours = Math.floor(slot / 100);
            const minutes = slot % 100;
            return new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              hours,
              minutes
            );
          })}
        />

        <button onClick={handleBooking}>Book Appointment</button>
      </div>
    </div>
  );
}

export default BookAppointment;
