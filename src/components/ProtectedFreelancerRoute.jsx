import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedFreelancerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "freelancer") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedFreelancerRoute;