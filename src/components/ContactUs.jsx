import React, { useState } from "react";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    full_name: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email eshte i detyrueshem";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email nuk eshte valid";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Telefoni eshte i detyrueshem";
    } else if (!/^\d{6,15}$/.test(form.phone)) {
      newErrors.phone = "Telefoni duhet te kete vetem numra (6-15 shifra)";
    }

    if (!form.full_name.trim()) {
      newErrors.full_name = "Emri eshte i detyrueshem";
    } else if (!/^[A-Za-zÇçËë\s]+$/.test(form.full_name)) {
      newErrors.full_name = "Emri duhet te permbaje vetem shkronja";
    }

    if (!form.message.trim()) {
      newErrors.message = "Mesazhi eshte i detyrueshem";
    } else if (form.message.trim().length < 5) {
      newErrors.message = "Mesazhi duhet te kete te pakten 5 karaktere";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "full_name" && !/^[A-Za-zÇçËë\s]*$/.test(value)) {
      return;
    }

    if (name === "phone" && !/^\d*$/.test(value)) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gabim gjate dergimit");
      }

      alert("Mesazhi u dergua me sukses!");

      setForm({
        email: "",
        phone: "",
        full_name: "",
        message: "",
      });

      setErrors({});
    } catch (err) {
      console.error(err);
      alert(err.message || "Gabim gjate dergimit!");
    }
  };

  return (
    <div className="bg-[#e6f0e4] min-h-screen font-sans text-gray-800">
      <Navbar />

      <section className="flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-3xl bg-gradient-to-br from-[#d3e4cd] to-[#b8cab6] border border-[#a4bba0] rounded-2xl shadow-2xl p-10 space-y-6">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-4">
            Kontaktoni me ne
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className={`bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 ${
                  errors.email
                    ? "border border-red-500 focus:ring-red-400"
                    : "focus:ring-green-600"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Telefoni"
                className={`bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 ${
                  errors.phone
                    ? "border border-red-500 focus:ring-red-400"
                    : "focus:ring-green-600"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Emri i plote"
              className={`bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 ${
                errors.full_name
                  ? "border border-red-500 focus:ring-red-400"
                  : "focus:ring-green-600"
              }`}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Mesazhi juaj"
              rows="4"
              className={`bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 ${
                errors.message
                  ? "border border-red-500 focus:ring-red-400"
                  : "focus:ring-green-600"
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition-all shadow-md hover:scale-105"
          >
            Dergo Mesazh
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;