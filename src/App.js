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
import AdminDashboard from "./components/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import GigsPage from "./components/GigsPage";
import GigDetails from "./components/GigDetails";


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/gigs/:id" element={<GigDetails />} />

          {/* Auth */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Punedhenes */}
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

