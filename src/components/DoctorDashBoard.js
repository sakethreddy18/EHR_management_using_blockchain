import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../CSS/DoctorDashBoard.css";

const DoctorDashBoardPage = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/doctor/" + address + "/doctorpermissionpage");
  };
  const viewPatientRecords = () => {
    navigate("/doctor/" + address + "/viewrec");
  };

  return (
    <div className="DoctorDashBoard">
      <h2>Doctor Dashboard</h2>
      <p>Hello, doctor at address: {address}</p>
      <button onClick={handleClick}>Create EHR</button>
      <button onClick={viewPatientRecords}>View Patient Records</button>
    </div>
  );
};

export default DoctorDashBoardPage;
