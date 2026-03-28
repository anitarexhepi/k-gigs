import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCity } from "react-icons/fa";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  city: "",
  role: "freelancer",
};

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Fjalëkalimet nuk përputhen." });
      return;
    }

    const nameParts = formData.fullName.trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || " ";

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          city: formData.city,
          role: formData.role,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setErrors({ general: result.message || "Regjistrimi dështoi." });
        return;
      }

      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginData.success) {
        setErrors({ general: loginData.message || "Gabim gjatë kyçjes." });
        return;
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
      localStorage.setItem("role", loginData.user.role);
      localStorage.setItem("userId", loginData.user.id);
      window.dispatchEvent(new Event("authChanged"));

      resetForm();

      navigate(
        loginData.user.role === "freelancer"
          ? "/freelancer-dashboard"
          : "/punedhenes-dashboard"
      );
    } catch (err) {
      console.error(err);
      setErrors({ general: "Diçka shkoi gabim. Provo përsëri." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f1f6f0] pt-7 py-10 pb-16">
      <div className="md:w-1/2 bg-[#d9e9d8] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl font-bold text-[#36563c] mb-4">
            Mirë se vini në K-Gigs
          </h1>
          <p className="text-[#4e6a51] text-lg mb-6">
            Lidhuni, punoni dhe rritni karrierën tuaj në Kosovë
          </p>
          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="Ilustrim Regjistrimi"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10"
        >
          <h2 className="text-4xl font-bold text-center text-[#4e6a51] mb-2">
            Krijo një llogari
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Është falas dhe zgjat vetëm një minutë!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="grid md:grid-cols-2 gap-5">
              <FloatingInput
                icon={<FaUser />}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                label="Emri dhe Mbiemri"
                type="text"
              />
              <FloatingInput
                icon={<FaEnvelope />}
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                type="email"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <FloatingInput
                icon={<FaLock />}
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Fjalëkalimi"
                type="password"
              />
              <FloatingInput
                icon={<FaLock />}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                label="Konfirmo Fjalëkalimin"
                type="password"
              />
            </div>

            {errors.confirmPassword && (
              <span className="text-red-500 text-sm block">
                {errors.confirmPassword}
              </span>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <FloatingInput
                icon={<FaPhone />}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                label="Numri i telefonit"
                type="text"
              />
              <FloatingInput
                icon={<FaCity />}
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="Qyteti"
                type="text"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Roli</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 outline-none bg-white focus:ring-2 focus:ring-[#8dbd89]"
              >
                <option value="freelancer">Freelancer</option>
                <option value="punedhenes">Punëdhënës</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 rounded-md bg-[#4e6a51] text-white font-semibold text-lg shadow-md hover:bg-[#3a4f39] transition duration-300"
            >
              Krijo Llogari
            </motion.button>

            {errors.general && (
              <p className="text-center text-red-500 text-sm mt-3">
                {errors.general}
              </p>
            )}

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Ke llogari?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#4e6a51] font-semibold hover:underline cursor-pointer"
                >
                  Kyçu këtu
                </span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const FloatingInput = ({ icon, label, type, name, value, onChange }) => (
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
      {icon}
    </span>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required
      autoComplete={type === "password" ? "new-password" : "off"}
      className="peer pl-10 pt-4 pb-2 w-full rounded-md border border-gray-300 bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#8dbd89] transition"
      placeholder={label}
    />
    <label
      htmlFor={name}
      className="absolute left-10 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#4e6a51]"
    >
      {label}
    </label>
  </div>
);

export default SignUp;