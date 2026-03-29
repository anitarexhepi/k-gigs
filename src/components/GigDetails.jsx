import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchGigById } from "../api/gigsApi";
import { applyToGig } from "../api/freelancerApi";

export default function GigDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  const [coverLetter, setCoverLetter] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const g = await fetchGigById(id);
        setGig(g);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onApply = async () => {
    if (!token) return nav("/login");

    if (role !== "freelancer") {
      return setApplyError("Vetëm freelancer mund të aplikojë.");
    }

    try {
      setApplyLoading(true);
      setApplyError("");
      setApplyMessage("");

      await applyToGig({
        gig_id: Number(id),
        cover_letter: coverLetter,
      });

      setApplyMessage("Aplikimi u dërgua me sukses.");
      setCoverLetter("");
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("A je i sigurt?");
    if (!confirmed) return;

    await fetch(`http://localhost:5000/api/gigs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Gig u fshi");
    nav("/punedhenes-dashboard");
  };

  if (loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#eef6ec] pt-28 px-4 pb-12">
      <div className="max-w-5xl mx-auto">

        <Link to="/gigs" className="text-sm text-gray-600 hover:underline">
          ← Kthehu
        </Link>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#5f8367] to-[#8ab48c] text-white rounded-3xl shadow-lg p-6 mt-4">
          <h1 className="text-3xl font-extrabold">{gig.title}</h1>
          <p className="mt-2 text-white/90">
            {gig.location || "—"} • €{gig.budget || "—"}
          </p>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-[#36563c] mb-3">
            Përshkrimi i punës
          </h2>
          <p className="text-gray-700 leading-6">
            {gig.description}
          </p>
        </div>
        {/* INFO BOX */}
    <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500">Lokacioni</p>
            <p className="font-semibold">{gig.location || "—"}</p>
    </div>

  <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500">Buxheti</p>
            <p className="font-semibold">€{gig.budget || "—"}</p>
  </div>
</div>

        {/* ACTIONS */}
        <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
          {role === "punedhenes" ? (
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => nav(`/edit-gig/${id}`)}
                className="px-5 py-2 rounded-xl bg-[#4f6d54] text-white font-semibold hover:bg-[#3f5944]"
              >
                Edito
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl border border-red-500 text-red-600 font-semibold hover:bg-red-50"
              >
                Fshije
              </button>
            </div>
          ) : (
            
            <div>
              <h2 className="text-lg font-bold text-[#36563c] mb-3">
                Apliko për këtë gig
              </h2>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Shkruaj cover letter..."
                rows={5}
                className="w-full border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-green-300 outline-none"
              />

              <button
                onClick={onApply}
                disabled={applyLoading}
                className="mt-4 px-6 py-3 rounded-2xl bg-[#5e7f63] text-white font-semibold hover:bg-[#4b6a50]"
              >
                {applyLoading ? "Duke aplikuar..." : "Apliko"}
              </button>

              {applyError && (
                <p className="text-red-500 mt-2">{applyError}</p>
              )}

              {applyMessage && (
                <p className="text-green-600 mt-2">{applyMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}