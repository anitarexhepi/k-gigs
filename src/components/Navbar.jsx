import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const rawUser = localStorage.getItem("user");

  const user = useMemo(() => {
    try {
      return rawUser ? JSON.parse(rawUser) : null;
    } catch {
      return null;
    }
  }, [rawUser]);

  const firstName = user?.first_name || "User";

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const userId = localStorage.getItem("userId");

      if (refreshToken) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken, userId }),
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (role === "freelancer") return "/freelancer-dashboard";
    if (role === "punedhenes") return "/punedhenes-dashboard";
    if (role === "admin") return "/admin-dashboard";
    return "/";
  };

  return (
    <nav className="bg-[#6b8f71] text-white px-6 py-4 flex items-center justify-between shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">K-Gigs</span>
      </div>

      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="hover:text-[#d3e4cd] transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-[#d3e4cd] transition">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-[#d3e4cd] transition">
          Contact Us
        </Link>
        <Link to="/gigs" className="hover:text-[#d3e4cd] transition">
          Gigs
        </Link>

        {token && (
          <Link
            to={getDashboardLink()}
            className="hover:text-[#d3e4cd] transition font-semibold"
          >
            Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {!token ? (
          <>
            <Link to="/login" className="text-white hover:text-[#d3e4cd] transition">
              Log In
            </Link>
            <Link to="/signup" className="text-white hover:text-[#d3e4cd] transition">
              Sign Up
            </Link>
            <Link
              to="/post-gig"
              className="bg-[#5e7f63] hover:bg-[#a5c4aa] text-white font-semibold px-4 py-2 rounded transition duration-200"
            >
              Post a Gig
            </Link>
          </>
        ) : (
          <>
            <span className="hidden md:inline text-sm text-white/90">
              Hi, {firstName}
            </span>

            {(role === "punedhenes" || role === "admin") && (
              <Link
                to="/post-gig"
                className="bg-[#5e7f63] hover:bg-[#a5c4aa] text-white font-semibold px-4 py-2 rounded transition duration-200"
              >
                Post a Gig
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded transition duration-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;