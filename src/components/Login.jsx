import React from 'react';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        
       
        <div className="p-10 bg-[#f9f9f9]">
        <h2 className="text-4xl font-bold mb-8" style={{ color: 'rgb(100, 146, 104)' }}>
            Kyçje në K-gigs
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Emaili</label>
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 0 0 2px #6fd09e33' }}
                className="flex items-center border border-gray-300 rounded-full px-4 py-2 transition"
              >
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  placeholder="Shkruaj emailin tënd"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </motion.div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Fjalëkalimi</label>
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 0 0 2px #6fd09e33' }}
                className="flex items-center border border-gray-300 rounded-full px-4 py-2 transition"
              >
                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="password"
                  placeholder="Shkruaj fjalëkalimin"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 text-white text-sm font-semibold rounded-full transition duration-200 shadow-md"
              style={{
                background: 'linear-gradient(to right,rgb(99, 148, 113),rgb(106, 192, 135))',
              }}
            >
              Kyçu
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-gray-700 text-center">
            Nuk ke llogari?{' '}
            <a href="#" className="text-[#6fd09e] underline">Regjistrohu si klient</a> ose{' '}
            <a href="#" className="text-[#6fd09e] underline">Regjistrohu si punëkërkues</a>
          </p>
        </div>

       
        <div
          className="hidden md:flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right,rgb(122, 169, 136),rgb(86, 145, 106))',
          }}
        >
<motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center px-8"
          >
           
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
             Filloni rrugëtimin tuaj ne K-gigs!
            </h2>
            <p className="mt-4 text-white text-sm">
             Lidhuni me punëdhënësit apo ofruesit e shërbimeve që ju përshtaten.
            </p>
          </motion.div>


    </div>
      </div>
    </div>
  );
};

export default Login;