import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/PatientDashBoard.css";

const PatientDashBoard = () => {
  const { address } = useParams(); // Retrieve the address from the URL parameter
  const navigate = useNavigate();
  const viewRecord = () => {
    navigate("/patient/" + address + "/viewrecord");
  };

  const permissionsTab = () => {
    navigate("/patient/" + address + "/permissionstab");
  };
  const writepermission = () => {
    navigate("/patient/" + address + "/writepermission");
  };

  const insuranceclaim = () => {
    navigate("/patient/" + address + "/raiseclaim");
  };

  const viewInsuranceClaim = () => {
    navigate("/patient/" + address + "/viewclaim");
  };

  const bookAppointment = () => {
    navigate("/patient/" + address + "/bookappointment");
  };

  return (
    <div className="patientdashboard">
      <h2>Patient Dashboard</h2>
      <p>Hello, Patient at address: {address}</p>

      <button onClick={viewRecord}>View Record</button>
      <button onClick={permissionsTab}>View Permission</button>
      <button onClick={writepermission}>Write Permission</button>
      <button onClick={insuranceclaim}>Insurance Claim</button>
      <button onClick={viewInsuranceClaim}> View Claims</button>
      <button onClick={bookAppointment}> Book Appointment</button>
    </div>
  );
};

export default PatientDashBoard;
