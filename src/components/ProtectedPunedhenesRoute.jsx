import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, refreshAccessToken } from "../utils/authUtils";

const ProtectedPunedhenesRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "punedhenes") {
        setAllowed(false);
        setChecking(false);
        return;
      }

      if (!token) {
        const newToken = await refreshAccessToken();
        setAllowed(!!newToken);
        setChecking(false);
        return;
      }

      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        setAllowed(!!newToken);
        setChecking(false);
        return;
      }

      setAllowed(true);
      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) {
    return <div className="text-center mt-10">Duke verifikuar...</div>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedPunedhenesRoute;