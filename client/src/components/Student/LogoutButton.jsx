import React from "react";
import logout from "../../assets/images/logout.png";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Layout/Navbar.module.css";

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
    window.location.reload(false);
  };

  return (
    <button
      type="button"
      className="btn btn-outline-primary me-2"
      onClick={handleLogout}
    >
      Sign Out
    </button>
  );
};
export default LogoutButton;
