import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import HomePage from "./components/HomePage";
import Layout from './components/Layout';
import ContactUs from "./components/ContactUs";

import SignUp from './components/SignUp';
import Login from './components/Login';
import PostGig from "./components/PostGig";
import PunedhenesDashboard from "./components/PunedhenesDashboard";
import ProtectedPunedhenesRoute from "./components/ProtectedPunedhenesRoute";

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

          {/* PUNEDHENES ONLY */}
          <Route
            path="/post-gig"
            element={
              <ProtectedPunedhenesRoute>
                <PostGig />
              </ProtectedPunedhenesRoute>
            }
          />

          <Route
            path="/punedhenes-dashboard"
            element={
              <ProtectedPunedhenesRoute>
                <PunedhenesDashboard />
              </ProtectedPunedhenesRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

