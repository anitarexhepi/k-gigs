import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
    status: "open",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/gigs/${id}`);
        const data = await res.json();

        const gig = data?.gig || data;

        setFormData({
          title: gig.title || "",
          description: gig.description || "",
          category: gig.category || "",
          location: gig.location || "",
          budget: gig.budget ?? "",
          status: gig.status || "open",
        });
      } catch (error) {
        console.error("Gabim gjatë marrjes së gig-ut:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:5000/api/gigs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Ndodhi një gabim gjatë editimit.");
        setSaving(false);
        return;
      }

      alert("Gig-u u editua me sukses.");
      navigate(`/gigs/${id}`);
    } catch (error) {
      console.error("Gabim gjatë editimit:", error);
      alert("Gabim në server.");
    } finally {
      setSaving(false);
    }
  };

  if (!token) return <Navigate to="/login" />;
  if (role !== "punedhenes") return <Navigate to="/" />;

  if (loading) {
    return <p className="mt-20 text-center">Po ngarkohet gig-u...</p>;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 mt-16">
        <h1 className="text-4xl font-bold text-[#36563c] mb-8">Edit Gig</h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Titulli</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="p.sh. Web Designer"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#36563c]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Përshkrimi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Përshkruaj punën..."
              rows="5"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#36563c]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Kategoria</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="p.sh. Design"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#36563c]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Lokacioni</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="p.sh. Prishtinë"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#36563c]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Buxheti (€)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="p.sh. 250"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#36563c]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Statusi</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#36563c]"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#36563c] text-white py-3 rounded-xl font-semibold hover:bg-[#2e4a33] transition disabled:opacity-70"
            >
              {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/gigs/${id}`)}
              className="flex-1 border border-[#36563c] text-[#36563c] py-3 rounded-xl font-semibold hover:bg-[#f1f5f1] transition"
            >
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGig;