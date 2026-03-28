import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { fetchGigs } from "../api/gigsApi";
import {
  fetchMyApplications,
  fetchMyCv,
  saveMyCv,
  deleteMyCv,
  updateMyApplication,
  deleteMyApplication,
} from "../api/freelancerApi";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-extrabold text-[#36563c] mt-2">{value}</h3>
      {subtitle ? <p className="text-sm text-gray-500 mt-2">{subtitle}</p> : null}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-2xl font-bold text-[#36563c] mb-4">{children}</h2>
  );
}

function normalizeText(v) {
  return String(v || "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ");
}

function splitKeywords(text) {
  return normalizeText(text)
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length >= 3);
}

function uniqueArray(arr) {
  return [...new Set(arr)];
}

function getCvKeywords(cv) {
  const normalizedSkills = normalizeText(cv?.skills || "");

  const skillPhrases = normalizedSkills
    .split(",")
    .map((s) => normalizeText(s))
    .filter(Boolean);

  const skillWords = normalizedSkills
    .split(/[,\s]+/)
    .map((s) => normalizeText(s))
    .filter((s) => s.length >= 2);

  const bioWords = splitKeywords(cv?.bio || "");
  const expWords = splitKeywords(cv?.experience || "");
  const eduWords = splitKeywords(cv?.education || "");

  return {
    skills: uniqueArray([...skillPhrases, ...skillWords]),
    bioWords: uniqueArray(bioWords),
    expWords: uniqueArray(expWords),
    eduWords: uniqueArray(eduWords),
  };
}

function matchScore(gig, cv) {
  if (!cv) return 0;

  const gigTitle = normalizeText(gig?.title || "");
  const gigCategory = normalizeText(gig?.category || "");
  const gigLocation = normalizeText(gig?.location || "");
  const gigDescription = normalizeText(gig?.description || "");
  const gigText = `${gigTitle} ${gigCategory} ${gigDescription} ${gigLocation}`;

  const { skills, bioWords, expWords, eduWords } = getCvKeywords(cv);

  let score = 0;
  let directMatches = 0;

  skills.forEach((skill) => {
    if (!skill) return;

    if (gigTitle.includes(skill)) {
      score += skill.includes(" ") ? 8 : 6;
      directMatches += 1;
      return;
    }

    if (gigCategory.includes(skill)) {
      score += skill.includes(" ") ? 7 : 5;
      directMatches += 1;
      return;
    }

    if (gigDescription.includes(skill)) {
      score += skill.includes(" ") ? 5 : 3;
      directMatches += 1;
    }
  });

  bioWords.forEach((word) => {
    if (gigText.includes(word)) {
      score += 1;
    }
  });

  expWords.forEach((word) => {
    if (gigText.includes(word)) {
      score += 2;
    }
  });

  eduWords.forEach((word) => {
    if (gigText.includes(word)) {
      score += 1;
    }
  });

  if (cv?.city && gig?.location && normalizeText(cv.city) === gigLocation) {
    score += 4;
    directMatches += 1;
  }

  if (
    skills.length > 0 &&
    skills.some((skill) => gigCategory.includes(skill) || gigTitle.includes(skill))
  ) {
    score += 3;
  }

  const textOnlyMatches =
    bioWords.some((word) => gigText.includes(word)) ||
    expWords.some((word) => gigText.includes(word)) ||
    eduWords.some((word) => gigText.includes(word));

  if (directMatches === 0 && !textOnlyMatches) {
    return 0;
  }

  return score;
}

const FreelancerDashboard = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const rawUser = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    parsedUser = null;
  }

  const firstName = parsedUser?.first_name || "Freelancer";

  const [cv, setCv] = useState(null);
  const [cvForm, setCvForm] = useState({
    full_name: "",
    bio: "",
    skills: "",
    experience: "",
    education: "",
    phone: "",
    city: "",
  });

  const [applications, setApplications] = useState([]);
  const [recommendedGigs, setRecommendedGigs] = useState([]);

  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [editingCoverLetter, setEditingCoverLetter] = useState("");
  const [savingApplication, setSavingApplication] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingCv, setSavingCv] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildRecommendedGigs = (gigsData, appData, cvData) => {
    const appliedGigIds = new Set((appData || []).map((a) => Number(a.gig_id)));

    return (gigsData || [])
      .filter((gig) => !appliedGigIds.has(Number(gig.id)))
      .filter((gig) => normalizeText(gig.status) === "open")
      .map((gig) => ({
        ...gig,
        matchPoints: matchScore(gig, cvData),
      }))
      .filter((gig) => gig.matchPoints >= 3)
      .sort((a, b) => {
        if (b.matchPoints !== a.matchPoints) {
          return b.matchPoints - a.matchPoints;
        }

        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      })
      .slice(0, 6);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const [cvRes, appRes, gigsRes] = await Promise.all([
        fetchMyCv(),
        fetchMyApplications(),
        fetchGigs({ page: 1, limit: 50, status: "open" }),
      ]);

      const cvData = cvRes.data || null;
      const appData = appRes.data || [];
      const gigsData = gigsRes.items || [];

      setCv(cvData);
      setApplications(appData);

      setCvForm({
        full_name: cvData?.full_name || "",
        bio: cvData?.bio || "",
        skills: cvData?.skills || "",
        experience: cvData?.experience || "",
        education: cvData?.education || "",
        phone: cvData?.phone || "",
        city: cvData?.city || "",
      });

      setRecommendedGigs(buildRecommendedGigs(gigsData, appData, cvData));
    } catch (err) {
      console.error(err);
      setError(err.message || "Gabim gjatë ngarkimit të dashboard-it");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "freelancer") {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [token, role]);

  const stats = useMemo(() => {
    const total = applications.length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    return { total, accepted, pending, rejected };
  }, [applications]);

  const profileCompletion = useMemo(() => {
    const fields = [
      cvForm.full_name,
      cvForm.bio,
      cvForm.skills,
      cvForm.experience,
      cvForm.education,
      cvForm.phone,
      cvForm.city,
    ];

    const filled = fields.filter((x) => String(x || "").trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [cvForm]);

  const handleCvChange = (e) => {
    const { name, value } = e.target;
    setCvForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCvSubmit = async (e) => {
    e.preventDefault();
    setSavingCv(true);
    setError("");
    setMessage("");

    try {
      const res = await saveMyCv(cvForm);
      const savedCv = res.data || null;

      setCv(savedCv);
      setCvForm({
        full_name: savedCv?.full_name || "",
        bio: savedCv?.bio || "",
        skills: savedCv?.skills || "",
        experience: savedCv?.experience || "",
        education: savedCv?.education || "",
        phone: savedCv?.phone || "",
        city: savedCv?.city || "",
      });

      const [appRes, gigsRes] = await Promise.all([
        fetchMyApplications(),
        fetchGigs({ page: 1, limit: 50, status: "open" }),
      ]);

      const appData = appRes.data || [];
      const gigsData = gigsRes.items || [];

      setApplications(appData);
      setRecommendedGigs(buildRecommendedGigs(gigsData, appData, savedCv));
      setMessage("Profili/CV u ruajt me sukses. Rekomandimet u përditësuan.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gabim gjatë ruajtjes së CV-së");
    } finally {
      setSavingCv(false);
    }
  };

  const handleDeleteCv = async () => {
    const confirmed = window.confirm("A je i sigurt që don me fshi CV-në?");
    if (!confirmed) return;

    try {
      setSavingCv(true);
      setError("");
      setMessage("");

      await deleteMyCv();

      setCv(null);
      setCvForm({
        full_name: "",
        bio: "",
        skills: "",
        experience: "",
        education: "",
        phone: "",
        city: "",
      });

      const [appRes, gigsRes] = await Promise.all([
        fetchMyApplications(),
        fetchGigs({ page: 1, limit: 50, status: "open" }),
      ]);

      const appData = appRes.data || [];
      const gigsData = gigsRes.items || [];

      setApplications(appData);
      setRecommendedGigs(buildRecommendedGigs(gigsData, appData, null));
      setMessage("CV u fshi me sukses.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gabim gjatë fshirjes së CV-së");
    } finally {
      setSavingCv(false);
    }
  };

  const handleStartEditApplication = (app) => {
    setEditingApplicationId(app.id);
    setEditingCoverLetter(app.cover_letter || "");
    setMessage("");
    setError("");
  };

  const handleCancelEditApplication = () => {
    setEditingApplicationId(null);
    setEditingCoverLetter("");
  };

  const handleSaveApplication = async (applicationId) => {
    try {
      setSavingApplication(true);
      setError("");
      setMessage("");

      await updateMyApplication(applicationId, {
        cover_letter: editingCoverLetter,
      });

      const appRes = await fetchMyApplications();
      const appData = appRes.data || [];
      setApplications(appData);

      setEditingApplicationId(null);
      setEditingCoverLetter("");
      setMessage("Aplikimi u përditësua me sukses.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gabim gjatë përditësimit të aplikimit");
    } finally {
      setSavingApplication(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    const confirmed = window.confirm("A je i sigurt që don me tërheq këtë aplikim?");
    if (!confirmed) return;

    try {
      setSavingApplication(true);
      setError("");
      setMessage("");

      await deleteMyApplication(applicationId);

      const [appRes, gigsRes] = await Promise.all([
        fetchMyApplications(),
        fetchGigs({ page: 1, limit: 50, status: "open" }),
      ]);

      const appData = appRes.data || [];
      const gigsData = gigsRes.items || [];

      setApplications(appData);
      setRecommendedGigs(buildRecommendedGigs(gigsData, appData, cv));
      setMessage("Aplikimi u tërhoq me sukses.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gabim gjatë fshirjes së aplikimit");
    } finally {
      setSavingApplication(false);
    }
  };

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "freelancer") return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef6ec] pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-md p-8">
            <p className="text-center text-gray-600">
              Po ngarkohet freelancer dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef6ec] pt-28 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#5f8367] to-[#8ab48c] text-white rounded-3xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-extrabold">Mirë se erdhe, {firstName}</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Këtu mund ta menaxhosh profilin tënd, CV-në, aplikimet dhe gig-et e rekomanduara.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/gigs"
              className="px-5 py-3 rounded-2xl bg-white text-[#36563c] font-semibold hover:opacity-90 transition"
            >
              Shiko të gjitha gigs
            </Link>
            <a
              href="#cv-section"
              className="px-5 py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Plotëso CV
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <StatCard title="Gjithsej aplikime" value={stats.total} />
          <StatCard title="Accepted" value={stats.accepted} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="Rejected" value={stats.rejected} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section id="cv-section" className="bg-white rounded-3xl shadow-md p-7">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <SectionTitle>My Profile / CV</SectionTitle>
                <div className="text-sm text-gray-600">
                  Plotësimi i profilit{" "}
                  <span className="font-bold text-[#36563c]">{profileCompletion}%</span>
                </div>
              </div>

              <form onSubmit={handleCvSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Emri i plotë</label>
                    <input
                      type="text"
                      name="full_name"
                      value={cvForm.full_name}
                      onChange={handleCvChange}
                      className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                      placeholder="p.sh. Sara Poniku"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Qyteti</label>
                    <input
                      type="text"
                      name="city"
                      value={cvForm.city}
                      onChange={handleCvChange}
                      className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                      placeholder="p.sh. Prishtinë"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Telefoni</label>
                    <input
                      type="text"
                      name="phone"
                      value={cvForm.phone}
                      onChange={handleCvChange}
                      className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                      placeholder="049123123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={cvForm.skills}
                      onChange={handleCvChange}
                      className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                      placeholder="React, Node.js, MySQL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={cvForm.bio}
                    onChange={handleCvChange}
                    rows={4}
                    className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Shkruaj një bio të shkurtër profesionale..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Përvoja</label>
                  <textarea
                    name="experience"
                    value={cvForm.experience}
                    onChange={handleCvChange}
                    rows={4}
                    className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Shkruaj eksperiencën tënde..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Edukimi</label>
                  <textarea
                    name="education"
                    value={cvForm.education}
                    onChange={handleCvChange}
                    rows={3}
                    className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Shkruaj shkollimin / trajnimet..."
                  />
                </div>

                <div className="flex flex-col items-end gap-3">
                  {message && (
                    <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm">
                      {message}
                    </div>
                  )}

                  {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {cv && (
                      <button
                        type="button"
                        onClick={handleDeleteCv}
                        disabled={savingCv}
                        className="px-6 py-3 rounded-2xl border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-70"
                      >
                        Fshije CV-në
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={savingCv}
                      className="px-6 py-3 rounded-2xl bg-[#4f6d54] text-white font-semibold hover:bg-[#3f5944] transition disabled:opacity-70"
                    >
                      {savingCv ? "Duke u ruajtur..." : cv ? "Përditëso CV" : "Ruaj CV"}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-3xl shadow-md p-7">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <SectionTitle>My Applications</SectionTitle>
                <span className="text-sm text-gray-500">Aplikimet e mia të fundit</span>
              </div>

              {applications.length === 0 ? (
                <div className="text-gray-600">
                  Ende nuk ke aplikuar në asnjë gig.{" "}
                  <Link to="/gigs" className="text-[#36563c] font-semibold hover:underline">
                    Shiko gigs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border rounded-2xl p-4 flex items-start justify-between gap-4 flex-wrap"
                    >
                      <div className="flex-1 min-w-[260px]">
                        <h3 className="font-bold text-[#36563c]">
                          {app.gig_title || `Gig #${app.gig_id}`}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Aplikuar më{" "}
                          {app.applied_at
                            ? new Date(app.applied_at).toLocaleDateString()
                            : "—"}
                        </p>

                        {editingApplicationId === app.id ? (
                          <div className="mt-3">
                            <textarea
                              value={editingCoverLetter}
                              onChange={(e) => setEditingCoverLetter(e.target.value)}
                              rows={4}
                              className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                              placeholder="Përditëso cover letter..."
                            />

                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() => handleSaveApplication(app.id)}
                                disabled={savingApplication}
                                className="px-4 py-2 rounded-xl bg-[#4f6d54] text-white font-semibold hover:bg-[#3f5944] transition disabled:opacity-70"
                              >
                                {savingApplication ? "Duke ruajtur..." : "Ruaj"}
                              </button>

                              <button
                                onClick={handleCancelEditApplication}
                                disabled={savingApplication}
                                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                              >
                                Anulo
                              </button>
                            </div>
                          </div>
                        ) : app.cover_letter ? (
                          <p className="text-sm text-gray-700 mt-2">{app.cover_letter}</p>
                        ) : (
                          <p className="text-sm text-gray-400 mt-2">Pa cover letter</p>
                        )}

                        {app.status === "pending" && editingApplicationId !== app.id && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleStartEditApplication(app)}
                              className="px-4 py-2 rounded-xl border border-[#4f6d54] text-[#36563c] font-semibold hover:bg-green-50 transition"
                            >
                              Edito
                            </button>

                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              disabled={savingApplication}
                              className="px-4 py-2 rounded-xl border border-red-400 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-70"
                            >
                              Tërhiqe aplikimin
                            </button>
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {app.status || "pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-3xl shadow-md p-7">
              <SectionTitle>Recommended Gigs</SectionTitle>

              {!cvForm.skills.trim() &&
              !cvForm.bio.trim() &&
              !cvForm.experience.trim() &&
              !cvForm.city.trim() ? (
                <p className="text-gray-600">
                  Plotëso CV-në që të marrësh rekomandime të sakta.
                </p>
              ) : recommendedGigs.length === 0 ? (
                <p className="text-gray-600">
                  Nuk u gjet asnjë gig me përputhje të mjaftueshme për profilin tënd.
                </p>
              ) : (
                <div className="space-y-4">
                  {recommendedGigs.map((gig) => (
                    <div key={gig.id} className="border rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#36563c]">{gig.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {gig.category || "—"} • {gig.location || "—"}
                          </p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-900 font-semibold">
                          {gig.matchPoints} pts
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">
                        Buxheti {gig.budget ? `${gig.budget} €` : "—"}
                      </p>

                      <div className="mt-3">
                        <Link
                          to={`/gigs/${gig.id}`}
                          className="inline-block px-4 py-2 rounded-xl bg-[#5e7f63] text-white hover:bg-[#4b6a50] transition"
                        >
                          Shiko detajet
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-3xl shadow-md p-7">
              <SectionTitle>Quick Tips</SectionTitle>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>• Plotëso emrin, bio-n dhe skills për profil më të fortë.</li>
                <li>• Apliko në gig-e që përputhen me skills dhe qytetin tënd.</li>
                <li>• Mbaj CV-në të përditësuar për demo gjatë prezantimit.</li>
                <li>• Përdor filtrat te faqja e gigs për kërkim më të shpejtë.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;