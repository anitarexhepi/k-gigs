import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchGigById, fetchGigs } from "../api/gigsApi";
import { applyToGig } from "../api/freelancerApi";

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

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [fav, setFav] = useState(false);

  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyError, setApplyError] = useState("");

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

  const onApply = async () => {
    if (!token) return nav("/login");
    if (role !== "freelancer") return setApplyError("Vetëm freelancer mund të aplikojë.");

    try {
      setApplyLoading(true);
      await applyToGig({
        gig_id: Number(id),
        cover_letter: "Jam i interesuar për këtë gig.",
      });
      setApplyMessage("Aplikimi u dërgua me sukses.");
    } catch (err) {
      setApplyError("Aplikimi dështoi.");
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

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  return (
    <div className="bg-[#e6f0e4] min-h-screen pt-28 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/gigs">← Kthehu</Link>

        <h1 className="text-3xl font-bold mt-4">{gig.title}</h1>

        <div className="bg-white p-6 rounded mt-4">
          <p>{gig.description}</p>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col gap-3">

          {role === "punedhenes" ? (
            <>
              <button onClick={() => nav(`/edit-gig/${id}`)}>
                Edito
              </button>

              <button onClick={handleDelete}>
                Fshije
              </button>
            </>
          ) : (
            <>
              <button onClick={onApply} disabled={applyLoading}>
                {applyLoading ? "Duke aplikuar..." : "Apliko"}
              </button>

              <button onClick={toggleFav}>
                {fav ? "★ Saved" : "☆ Favorite"}
              </button>
            </>
          )}

          {applyError && <p className="text-red-500">{applyError}</p>}
          {applyMessage && <p className="text-green-500">{applyMessage}</p>}
        </div>
      </div>
    </div>
  );
}