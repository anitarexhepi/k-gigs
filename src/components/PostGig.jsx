import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../api/gigsApi";

const PostGig = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
    status: "open",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const payload = {
        ...form,
        budget: form.budget === "" ? null : Number(form.budget),
      };

      await createGig(payload);

      setSuccess("Gig u postua me sukses!");

      setTimeout(() => {
        navigate("/gigs");
      }, 1000);
    } catch (err) {
      setError(err.message || "Ndodhi një gabim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 pb-12">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-[#36563c] mb-6">Post a Gig</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Titulli</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="p.sh. Web Designer"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6b8f71]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Përshkrimi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Përshkruaj punën..."
              rows="5"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6b8f71]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Kategoria</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="p.sh. Design"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6b8f71]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Lokacioni</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="p.sh. Prishtinë"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6b8f71]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Buxheti (€)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="p.sh. 250"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6b8f71]"
              min="0"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Statusi</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6b8f71]"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5e7f63] hover:bg-[#4b6a50] text-white font-semibold py-3 rounded-xl transition disabled:opacity-70"
          >
            {loading ? "Duke u postuar..." : "Posto Gig-un"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostGig;