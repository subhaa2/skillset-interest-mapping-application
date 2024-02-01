import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/global.css";

import ITP from "./pages/Teacher/ITP";
import Login from "./pages/Login";
import StudentForm from "./pages/Student/StudentForm";
import Navbar from "./components/Layout/Navbar";
import PrismSummary from "./pages/Teacher/PrismSummary";
import TeacherLanding from "./pages/Teacher/TeacherLanding";
import ITPSummary from "./pages/Teacher/ITPSummary";
import Prism from "./pages/Teacher/Prism";
import ViewAllStudents from "./pages/Teacher/ViewAllStudents";

function App() {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    // Check for redirection information on component mount
    const storedRedirectTo = localStorage.getItem("redirectTo");
    if (storedRedirectTo) {
      setRedirectTo(storedRedirectTo);
      localStorage.removeItem("redirectTo"); // Clear stored value
    }
  }, []);

  return (
    <div className="">
      <Router>
        <Navbar />
        {/* Redirect based on the state or local storage */}
        {redirectTo && <Navigate to={redirectTo} />}

        <Routes>
          {/* DECLARE ALL PAGE LINKS HERE */}
          <Route path="/" element={<Login />} />
          <Route path="/teacher/itp" element={<ITP />} />
          <Route path="studentform" element={<StudentForm />} />
          <Route path="/teacher/itpsummary" element={<ITPSummary />} />
          <Route path="/teacher/prismsummary" element={<PrismSummary />} />
          <Route path="/teacher/" element={<TeacherLanding />} />
          <Route path="/teacher/prism" element={<Prism />} />
          <Route
            path="/teacher/viewallstudents"
            element={<ViewAllStudents />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
