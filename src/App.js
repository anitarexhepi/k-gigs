import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import HomePage from "./components/HomePage";
import Layout from './components/Layout';
import ContactUs from "./components/ContactUs";
import SignUp from './components/SignUp';
import Login from './components/Login';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
         
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
