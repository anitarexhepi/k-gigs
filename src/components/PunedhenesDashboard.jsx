import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function StatCard({ title, value, color = "green" }) {
  const styles = {
    green: "from-green-100 to-green-50 text-green-900",
    blue: "from-blue-100 to-blue-50 text-blue-900",
    yellow: "from-yellow-100 to-yellow-50 text-yellow-900",
    red: "from-red-100 to-red-50 text-red-900",
  };

  return (
    <div
      className={`bg-gradient-to-br ${styles[color]} rounded-3xl shadow-md p-5 border border-white/50`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-3xl font-extrabold mt-2">{value}</h3>
    </div>
  );
}

function statusLabel(status) {
  if (status === "accepted") return "Pranuar";
  if (status === "rejected") return "Refuzuar";
  return "Në pritje";
}

function statusClasses(status) {
  if (status === "accepted") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (status === "rejected") {
    return "bg-red-100 text-red-700 border-red-200";
  }
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

const PunedhenesDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const rawUser = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    parsedUser = null;
  }

  const firstName = parsedUser?.first_name || "Punëdhënës";

  const [myGigs, setMyGigs] = useState([]);
  const [applicationsByGig, setApplicationsByGig] = useState({});
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchApplicationsForGig = async (gigId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/gig/${gigId}`,
        { headers: getHeaders() }
      );
      const data = await res.json();

      setApplicationsByGig((prev) => ({
        ...prev,
        [gigId]: data.data || [],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (appId, status, gigId) => {
    try {
      await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchApplicationsForGig(gigId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gigs/my-gigs", {
          headers: getHeaders(),
        });
        const data = await res.json();
        const gigs = data.gigs || [];

        setMyGigs(gigs);

        gigs.forEach((gig) => {
          fetchApplicationsForGig(gig.id);
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token && role === "punedhenes") fetchGigs();
  }, [token, role]);

  const stats = useMemo(() => {
    const allApplications = Object.values(applicationsByGig).flat();
    return {
      gigs: myGigs.length,
      totalApps: allApplications.length,
      accepted: allApplications.filter((a) => a.status === "accepted").length,
      pending: allApplications.filter((a) => a.status === "pending").length,
      rejected: allApplications.filter((a) => a.status === "rejected").length,
    };
  }, [myGigs, applicationsByGig]);

  if (!token) return <Navigate to="/login" />;
  if (role !== "punedhenes") return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef6ec] pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-md p-8">
            <p className="text-center text-gray-600">
              Po ngarkohet dashboard-i i punëdhënësit...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef6ec] pt-28 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#5f8367] via-[#739a76] to-[#94bb95] text-white rounded-3xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-extrabold">Mirë se erdhe, {firstName}</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Këtu mund t’i menaxhosh gig-et e tua, t’i shohësh aplikimet që kanë ardhur
            dhe të vendosësh cilët kandidatë dëshiron t’i pranosh ose refuzosh.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/post-gig"
              className="px-5 py-3 rounded-2xl bg-white text-[#36563c] font-semibold hover:opacity-90 transition"
            >
              Posto një Gig
            </Link>

            <Link
              to="/gigs"
              className="px-5 py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Shiko të gjitha gigs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          <StatCard title="Gig-et e mia" value={stats.gigs} color="green" />
          <StatCard title="Gjithsej aplikime" value={stats.totalApps} color="blue" />
          <StatCard title="Në pritje" value={stats.pending} color="yellow" />
          <StatCard title="Pranuar" value={stats.accepted} color="green" />
          <StatCard title="Refuzuar" value={stats.rejected} color="red" />
        </div>

        <div className="space-y-8">
          {myGigs.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">Nuk keni postuar ende gig-e.</p>
              <Link
                to="/post-gig"
                className="inline-block mt-4 px-5 py-3 rounded-2xl bg-[#4f6d54] text-white font-semibold hover:bg-[#3f5944] transition"
              >
                Posto gig-un e parë
              </Link>
            </div>
          ) : (
            myGigs.map((gig) => {
              const gigApplications = applicationsByGig[gig.id] || [];

              return (
                <div
                  key={gig.id}
                  className="bg-white rounded-3xl shadow-md border border-[#dde7da] overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#f3f8f1] to-[#edf5ea] p-6 border-b">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h2 className="text-2xl font-bold text-[#2e4d35]">
                          {gig.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                          {gig.location || "Pa lokacion"} • €{gig.budget || "—"}
                        </p>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => navigate(`/gigs/${gig.id}`)}
                          className="bg-[#36563c] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#2e4d35] transition"
                        >
                          Shiko detajet
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                      <h3 className="text-lg font-bold text-[#36563c]">Aplikimet</h3>
                      <span className="text-sm text-gray-500">
                        {gigApplications.length} aplikim(e)
                      </span>
                    </div>

                    {gigApplications.length === 0 ? (
                      <div className="bg-[#f7faf6] border border-dashed border-[#cfdccc] rounded-2xl p-5 text-gray-500 text-sm">
                        Nuk ka aplikime ende për këtë gig.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {gigApplications.map((app) => (
                          <div
                            key={app.id}
                            className="border rounded-2xl p-4 bg-[#fcfefd] shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1 min-w-[260px]">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <p className="text-base font-bold text-[#2f4d36]">
                                    {app.user_email}
                                  </p>

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses(
                                      app.status
                                    )}`}
                                  >
                                    {statusLabel(app.status)}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-700 mt-3 leading-6">
                                  {app.cover_letter || "Pa cover letter"}
                                </p>
                              </div>

                              {app.status === "pending" && (
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    onClick={() =>
                                      handleStatusChange(app.id, "accepted", gig.id)
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                                  >
                                    Accept
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleStatusChange(app.id, "rejected", gig.id)
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>

                            {app.status === "accepted" && (
                              <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
                                <p className="text-sm font-bold text-green-800">
                                  Kandidati u pranua
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  A je e interesuar ta kontaktosh këtë person për hapat e ardhshëm?
                                </p>
                                <a
                                  href={`mailto:${app.user_email}`}
                                  className="inline-block mt-2 text-sm text-[#36563c] font-semibold underline"
                                >
                                  Kontakto freelancer-in: {app.user_email}
                                </a>
                              </div>
                            )}

                            {app.status === "rejected" && (
                              <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
                                <p className="text-sm font-bold text-red-700">
                                  Kandidati u refuzua
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PunedhenesDashboard;