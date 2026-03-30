import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { refreshAccessToken } from "./utils/authUtils";

const AboutUs = React.lazy(() => import("./components/AboutUs"));
const HomePage = React.lazy(() => import("./components/HomePage"));
const ContactUs = React.lazy(() => import("./components/ContactUs"));
const SignUp = React.lazy(() => import("./components/SignUp"));
const Login = React.lazy(() => import("./components/Login"));
const PostGig = React.lazy(() => import("./components/PostGig"));
const EditGig = React.lazy(() => import("./components/EditGig"));
const PunedhenesDashboard = React.lazy(() => import("./components/PunedhenesDashboard"));
const ProtectedPunedhenesRoute = React.lazy(() => import("./components/ProtectedPunedhenesRoute"));
const AdminDashboard = React.lazy(() => import("./components/AdminDashboard"));
const ProtectedAdminRoute = React.lazy(() => import("./components/ProtectedAdminRoute"));
const ProtectedFreelancerRoute = React.lazy(() => import("./components/ProtectedFreelancerRoute"));
const FreelancerDashboard = React.lazy(() => import("./components/FreelancerDashboard"));
const GigsPage = React.lazy(() => import("./components/GigsPage"));
const GigDetails = React.lazy(() => import("./components/GigDetails"));

function App() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token && refreshToken) {
        await refreshAccessToken();
        window.dispatchEvent(new Event("authChanged"));
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <Layout>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-green-700 font-semibold text-lg animate-pulse">
                Duke u ngarkuar...
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/gigs" element={<GigsPage />} />
            <Route path="/gigs/:id" element={<GigDetails />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/freelancer-dashboard"
              element={
                <ProtectedFreelancerRoute>
                  <FreelancerDashboard />
                </ProtectedFreelancerRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

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

            <Route
              path="/edit-gig/:id"
              element={
                <ProtectedPunedhenesRoute>
                  <EditGig />
                </ProtectedPunedhenesRoute>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;