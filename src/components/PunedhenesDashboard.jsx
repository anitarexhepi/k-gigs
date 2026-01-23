import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const PunedhenesDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gigs/my-gigs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMyGigs(data.gigs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token && role === "punedhenes") fetchGigs();
  }, [token, role]);

 
  if (!token) return <Navigate to="/login" />;
  if (role !== "punedhenes") return <Navigate to="/" />;

  if (loading) return <p className="mt-20 text-center">Po ngarkohet...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#36563c]">
        My Posted Gigs
      </h1>
      {myGigs.length === 0 && (
        <p className="text-gray-500">Nuk keni postuar ende gig-e.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {myGigs.map((gig) => (
          <div key={gig.id} className="bg-white p-5 rounded shadow">
            <h2 className="font-bold">{gig.title}</h2>
            <p className="text-sm text-gray-600">
              {gig.location} · €{gig.budget}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PunedhenesDashboard;







