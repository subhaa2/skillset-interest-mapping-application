import { useNavigate } from "react-router-dom";

const useAdminAuthCheck = (isTeacher) => {
  const navigate = useNavigate();
  let userRole = localStorage.getItem("userRole");
  if (!userRole || (userRole !== "admin" && isTeacher)) {
    localStorage.removeItem("userRole");
    navigate("/");
  }
};

export default useAdminAuthCheck;
