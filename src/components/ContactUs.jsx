import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  return (
    <div className="bg-[#e6f0e4] min-h-screen font-sans text-gray-800">
      <Navbar />

      <header className="relative h-[32rem] w-full bg-[#d3e4cd] flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/img/contact-bg.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-white/50 z-10"></div>

        <div className="relative z-20 text-green-900 text-center">
          <motion.h1
            className="text-5xl font-extrabold drop-shadow-lg font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Na Kontakto
          </motion.h1>
          <motion.p
            className="mt-4 max-w-xl text-lg text-green-800  drop-shadow-md mx-auto font-nunito"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Na shkruani për çdo pyetje apo sugjerim — jemi këtu për t’ju ndihmuar!
          </motion.p>
        </div>
      </header>

      <section className="flex items-center justify-center px-4 my-16">
        <motion.div
          className="w-full max-w-3xl bg-gradient-to-br from-[#d3e4cd] to-[#b8cab6] border border-[#a4bba0] rounded-2xl shadow-2xl p-10 space-y-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-green-800 text-center mb-4">
            Kontaktoni me ne
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 focus:ring-green-600"
            />
            <input
              type="text"
              placeholder="Telefoni"
              className="bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 focus:ring-green-600"
            />
          </div>
          <input
            type="text"
            placeholder="Emri i plotë"
            className="bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 focus:ring-green-600"
          />
          <textarea
            placeholder="Mesazhi juaj"
            rows="4"
            className="bg-white p-4 rounded-md w-full outline-none shadow-sm focus:ring-2 focus:ring-green-600"
          ></textarea>
          <button className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition-all shadow-md hover:scale-105">
            Dërgo Mesazh
          </button>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20">
        {[
          {
            icon: <Phone size={32} className="text-green-800" />,
            title: "(+383) 123 456",
            desc: "Na kontaktoni në çdo kohë",
          },
          {
            icon: <Mail size={32} className="text-green-800" />,
            title: "support@k-gigs.com",
            desc: "Na dërgoni një email kurdo që dëshironi",
          },
          {
            icon: <Globe size={32} className="text-green-800" />,
            title: "100% Online",
            desc: "Nuk kemi zyrë fizike, punojmë në distancë",
          },
        ].map((box, i) => (
          <motion.div
            key={i}
            className="bg-[#d3e4cd] text-center p-6 rounded-xl shadow hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-2">{box.icon}</div>
            <h3 className="text-lg font-semibold text-green-900">{box.title}</h3>
            <p className="text-sm text-green-900">{box.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default ContactUs;