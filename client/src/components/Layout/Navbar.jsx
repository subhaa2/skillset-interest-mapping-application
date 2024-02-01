import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import nyplogo from "../../assets/images/nyplogo.png";
import styles from "../../styles/Layout/Navbar.module.css";
import profile from "../../assets/images/profile.png";
import LogoutButton from "../Student/LogoutButton";
import NavbarLink from "./NavbarLink.jsx";

// const Navbar = () => {
//     return (
//         <nav>
//             <ul>
//                 <li>
//                     <img src={nyplogo} alt='Logo' />
//                 </li>
//                 <li>
//                     <NavLink to="login">Login</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/">Home</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/itp">ITP</NavLink>
//                 </li>
//                 {/* <li>
//                     <NavLink to="/">Home</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/">Home</NavLink>
//                 </li> */}
//             </ul>
//         </nav>
//     )
// };

const Navbar = () => {
  const userRole = localStorage.getItem("userRole");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const path = useLocation().pathname;

  if (!userRole) return null;
  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div className="col-md-3 mb-2 mb-md-0">
          <a
            href="#"
            className="d-inline-flex link-body-emphasis text-decoration-none"
          >
            <img src={nyplogo} alt="" height="75" />
          </a>
        </div>

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          {userRole === "regular" && (
            <>
              <NavbarLink linkPath="/studentform" currPath={path} text="Form" />
              <NavbarLink linkPath="#" currPath={path} text="About" />
            </>
          )}
          {userRole === "admin" && (
            <>
              <NavbarLink
                linkPath="/teacher/"
                currPath={path}
                text="Home"
              />
              <NavbarLink linkPath="/teacher/itp" currPath={path} text="ITP" />
              <NavbarLink
                linkPath="/teacher/itpsummary"
                currPath={path}
                text="ITP Summary"
              />
              <NavbarLink
                linkPath="/teacher/prism"
                currPath={path}
                text="Prism"
              />
              <NavbarLink
                linkPath="/teacher/prismsummary"
                currPath={path}
                text="Prism Summary"
              />
              <NavbarLink
                linkPath="/teacher/viewallstudents"
                currPath={path}
                text="Students"
              />
            </>
          )}
        </ul>

        <div className="col-md-3 text-end">
          <LogoutButton />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
