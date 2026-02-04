import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchGigById, fetchGigs } from "../api/gigsApi";

function getFavKey() {
  return "k-gigs:favorites";
}

function readFavs() {
  try {
    const raw = localStorage.getItem(getFavKey());
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeFavs(arr) {
  localStorage.setItem(getFavKey(), JSON.stringify(arr));
}

function guessSkillsFromText(text) {
  const t = String(text || "").toLowerCase();
  const out = [];
  const map = [
    ["react", "React"],
    ["node", "Node.js"],
    ["express", "Express"],
    ["mysql", "MySQL"],
    ["mongodb", "MongoDB"],
    ["ui", "UI/UX"],
    ["seo", "SEO"],
    ["marketing", "Marketing"],
    ["social", "Social Media"],
    ["design", "Design"],
  ];
  for (const [k, label] of map) {
    if (t.includes(k)) out.push(label);
  }
  return out.length ? [...new Set(out)] : ["Komunikim", "Përgjegjësi", "Puna në ekip"];
}

export default function GigDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [fav, setFav] = useState(false);

  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const skills = useMemo(() => {
    if (!gig) return [];
    return guessSkillsFromText(`${gig.title} ${gig.description} ${gig.category}`);
  }, [gig]);

  useEffect(() => {
    const favs = readFavs();
    setFav(favs.includes(Number(id)));
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setErr("");
      setLoading(true);
      try {
        const g = await fetchGigById(id);
        setGig(g);
      } catch (e) {
        setErr(e.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  
  useEffect(() => {
    if (!gig) return;

    (async () => {
      setLoadingSimilar(true);
      try {
        const data = await fetchGigs({
          category: gig.category || "",
          location: gig.location || "",
          page: 1,
          limit: 6,
        });
        const items = (data.items || []).filter((x) => String(x.id) !== String(gig.id));
        setSimilar(items.slice(0, 4));
      } catch {
        setSimilar([]);
      } finally {
        setLoadingSimilar(false);
      }
    })();
  }, [gig]);

  const toggleFav = () => {
    const gigId = Number(id);
    const favs = readFavs();
    let next;
    if (favs.includes(gigId)) {
      next = favs.filter((x) => x !== gigId);
      setFav(false);
    } else {
      next = [...favs, gigId];
      setFav(true);
    }
    writeFavs(next);
  };

  const onApply = () => {
    
    
    alert("Aplikimi do të jetë së shpejti (Applications/CV po ndërtohet).");
  };

  return (
    <div className="bg-[#e6f0e4] min-h-screen pt-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/gigs" className="text-green-800 hover:underline">
            ← Kthehu te punët
          </Link>

          <button
            onClick={() => nav(-1)}
            className="text-sm px-4 py-2 rounded-full border border-green-700 text-green-800 hover:bg-green-50 transition"
            type="button"
          >
            Kthehu mbrapa
          </button>
        </div>

        {loading && <div className="mt-6">Loading...</div>}

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mt-6">
            {err}
          </div>
        )}

        {!loading && gig && (
          <>
            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-7">
                <h1 className="text-3xl font-extrabold text-green-900">
                  {gig.title}
                </h1>
                <div className="text-gray-600 mt-2">
                  {gig.category || "—"} • {gig.location || "—"}
                </div>

                <hr className="my-6" />

                <h2 className="text-lg font-bold text-green-900 mb-2">Përshkrimi</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {gig.description || "Nuk ka përshkrim."}
                </p>

                <hr className="my-6" />

                <h2 className="text-lg font-bold text-green-900 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-900"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <hr className="my-6" />

                <h2 className="text-lg font-bold text-green-900 mb-2">Kërkesat</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Eksperiencë relevante (ose projekt/portfolio)</li>
                  <li>Komunikim profesional me klientin</li>
                  <li>Respektim i afateve dhe cilësisë</li>
                </ul>
              </div>

              {}
              <div className="bg-white rounded-3xl shadow-md p-7 h-fit">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-600">Buxheti</div>
                    <div className="text-2xl font-extrabold text-green-800">
                      {gig.budget != null ? `${gig.budget} €` : "—"}
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-900">
                    {String(gig.status || "").toLowerCase() === "closed"
                      ? "mbyllur"
                      : "hapur"}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-700">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Lokacioni</span>
                    <span className="font-semibold">{gig.location || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Kategoria</span>
                    <span className="font-semibold">{gig.category || "—"}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={onApply}
                    className="w-full px-5 py-3 rounded-2xl bg-green-700 text-white hover:bg-green-800 transition font-semibold"
                    type="button"
                    disabled={String(gig.status || "").toLowerCase() === "closed"}
                    title={
                      String(gig.status || "").toLowerCase() === "closed"
                        ? "Kjo punë është mbyllur"
                        : "Apliko"
                    }
                  >
                    Apliko
                  </button>

                  <button
                    onClick={toggleFav}
                    className="w-full px-5 py-3 rounded-2xl border border-green-700 text-green-800 hover:bg-green-50 transition font-semibold"
                    type="button"
                  >
                    {fav ? "★ Ruajtur në favorites" : "☆ Ruaj në favorites"}
                  </button>

                  <div className="text-xs text-gray-500">
                   
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="mt-8 pb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-green-900">
                  Punë të ngjashme
                </h2>
                <Link to="/gigs" className="text-green-800 hover:underline text-sm">
                  Shiko të gjitha
                </Link>
              </div>

              {loadingSimilar && <div className="text-gray-600">Duke ngarkuar…</div>}

              {!loadingSimilar && similar.length === 0 && (
                <div className="text-gray-700">Nuk ka punë të ngjashme për momentin.</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {similar.map((g) => (
                  <div key={g.id} className="bg-white rounded-3xl shadow-md p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-green-900">{g.title}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {g.category || "—"} • {g.location || "—"} •{" "}
                          <span className="font-semibold text-green-800">
                            {g.budget != null ? `${g.budget} €` : "—"}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-900">
                        {String(g.status || "").toLowerCase() === "closed"
                          ? "mbyllur"
                          : "hapur"}
                      </span>
                    </div>

                    <p className="text-gray-700 mt-4 line-clamp-2">
                      {g.description || "Nuk ka përshkrim."}
                    </p>

                    <div className="mt-5 flex justify-end">
                      <Link
                        to={`/gigs/${g.id}`}
                        className="px-5 py-2 rounded-full bg-[#5e7f63] text-white hover:bg-[#4b6a50] transition"
                      >
                        Shiko detajet
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
