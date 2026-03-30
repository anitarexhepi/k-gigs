import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/api"; // 🔥 IMPORT I RI

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (!data.success) {
        setError(data.message || "Kycja deshtoi");
        return;
      }

   
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user.id);

      window.dispatchEvent(new Event("authChanged"));

      resetForm();

      switch (data.user.role) {
        case "freelancer":
          navigate("/freelancer-dashboard");
          break;
        case "punedhenes":
          navigate("/punedhenes-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Dicka shkoi gabim gjate kycjes.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="p-10 bg-[#f9f9f9]">
          <h2
            className="text-4xl font-bold mb-8"
            style={{ color: "rgb(100, 146, 104)" }}
          >
            Kycje ne K-Gigs
          </h2>

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold mb-2">Emaili</label>
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 0 2px #6fd09e33" }}
                className="flex items-center border border-gray-300 rounded-full px-4 py-2 transition"
              >
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Shkruaj emailin tend"
                  className="w-full bg-transparent outline-none text-sm"
                  required
                  autoComplete="off"
                />
              </motion.div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Fjalekalimi
              </label>
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 0 2px #6fd09e33" }}
                className="flex items-center border border-gray-300 rounded-full px-4 py-2 transition"
              >
                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Shkruaj fjalekalimin"
                  className="w-full bg-transparent outline-none text-sm"
                  required
                  autoComplete="new-password"
                />
              </motion.div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* BUTTON */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 text-white text-sm font-semibold rounded-full transition duration-200 shadow-md"
              style={{
                background:
                  "linear-gradient(to right,rgb(99, 148, 113),rgb(106, 192, 135))",
              }}
            >
              Kycu
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-gray-700 text-center">
            Nuk ke llogari?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#6fd09e] underline cursor-pointer"
            >
              Regjistrohu
            </span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="hidden md:flex items-center justify-center"
          style={{
            background:
              "linear-gradient(to right,rgb(122, 169, 136),rgb(86, 145, 106))",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center px-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              Filloni rrugetimin tuaj ne K-Gigs!
            </h2>
            <p className="mt-4 text-white text-sm">
              Lidhuni me punedhenesit apo ofruesit e sherbimeve qe ju pershtaten.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;