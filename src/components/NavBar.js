import React from "react";
import "../CSS/NavBar.css";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="NavP">
      <div class="navbar">
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Register
        </button>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default NavBar;
