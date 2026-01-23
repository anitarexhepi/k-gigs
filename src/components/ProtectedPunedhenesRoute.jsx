import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedPunedhenesRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role !== "punedhenes") return <Navigate to="/" />;

  return children;
};

export default ProtectedPunedhenesRoute;
