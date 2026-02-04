import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGigs, fetchGigsMeta } from "../api/gigsApi";

function hoursDiffFromNow(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const diffMs = Date.now() - d.getTime();
  return diffMs / (1000 * 60 * 60);
}

function isNewGig(dateStr) {
  const h = hoursDiffFromNow(dateStr);
  if (h == null) return false;
  return h <= 48; 
}

function normalizeNumber(v) {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}

function sortClient(items, sortKey) {
  const arr = [...(items || [])];

  if (sortKey === "newest") {
    arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
  if (sortKey === "budget_high") {
    arr.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
  }
  if (sortKey === "budget_low") {
    arr.sort((a, b) => Number(a.budget || 0) - Number(b.budget || 0));
  }
  return arr;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-5 w-2/3 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="mt-5 flex justify-end">
        <div className="h-9 w-32 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-10 text-center col-span-2">
      <div className="text-4xl mb-3"></div>
      <h3 className="text-xl font-bold text-green-900">Nuk ka rezultate</h3>
      <p className="text-gray-600 mt-2">
        Provo me ndryshu filtrat ose pastro krejt kërkimin.
      </p>
      <button
        onClick={onReset}
        className="mt-5 px-6 py-2 rounded-full bg-green-700 text-white hover:bg-green-800 transition"
        type="button"
      >
        Pastro filtrat
      </button>
    </div>
  );
}

export default function GigsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [sort, setSort] = useState("newest"); 
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([""]);
  const [locations, setLocations] = useState([""]);

  const [itemsRaw, setItemsRaw] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const params = useMemo(
    () => ({
      q,
      category,
      location,
      minBudget: normalizeNumber(minBudget),
      maxBudget: normalizeNumber(maxBudget),
      page,
      limit,
    }),
    [q, category, location, minBudget, maxBudget, page, limit]
  );

  const items = useMemo(() => sortClient(itemsRaw, sort), [itemsRaw, sort]);
  const totalPages = Math.max(1, Math.ceil(total / (limit || 10)));

  const load = async (override = {}) => {
    setErr("");
    setLoading(true);
    try {
      const data = await fetchGigs({ ...params, ...override });
      setItemsRaw(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      setErr(e.message || "Ndodhi një gabim");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGigsMeta();
        setCategories(["", ...(data.categories || [])]);
        setLocations(["", ...(data.locations || [])]);
      } catch {}
    })();
  }, []);

  
  useEffect(() => {
    load();
   
  }, [page]);

  const onReset = async () => {
    setQ("");
    setCategory("");
    setLocation("");
    setMinBudget("");
    setMaxBudget("");
    setSort("newest");
    setLimit(10);
    setPage(1);

    await load({
      q: "",
      category: "",
      location: "",
      minBudget: "",
      maxBudget: "",
      page: 1,
      limit: 10,
    });
  };

  const onSearch = async () => {
    setPage(1);
    await load({ page: 1 });
  };

  const onChangeAndReload = async (setter, key, value) => {
    setter(value);
    setPage(1);
    await load({ [key]: value, page: 1 });
  };

  return (
    <div className="bg-[#e6f0e4] min-h-screen pt-28 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">
          Punët
        </h1>

        {}
        <div className="bg-white rounded-3xl shadow-md p-5 mb-7">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              value={q}
              onChange={(e) => onChangeAndReload(setQ, "q", e.target.value)}
              placeholder="Kërko (titull/përshkrim)..."
              className="md:col-span-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
            />

            <select
              value={category}
              onChange={(e) =>
                onChangeAndReload(setCategory, "category", e.target.value)
              }
              className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
            >
              {categories.map((c) => (
                <option key={c || "__all"} value={c}>
                  {c === "" ? "Kategoria (të gjitha)" : c}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) =>
                onChangeAndReload(setLocation, "location", e.target.value)
              }
              className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
            >
              {locations.map((l) => (
                <option key={l || "__all"} value={l}>
                  {l === "" ? "Qyteti (të gjitha)" : l}
                </option>
              ))}
            </select>

            <input
              value={minBudget}
              onChange={(e) =>
                onChangeAndReload(setMinBudget, "minBudget", e.target.value)
              }
              placeholder="Minimum €"
              type="number"
              className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
            />

            <input
              value={maxBudget}
              onChange={(e) =>
                onChangeAndReload(setMaxBudget, "maxBudget", e.target.value)
              }
              placeholder="Maksimum €"
              type="number"
              className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {}
          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="text-sm text-gray-600">
              {loading ? "Duke ngarkuar..." : `Rezultate: ${total}`}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-300"
                title="Sortimi"
              >
                <option value="newest">Më të rejat</option>
                <option value="budget_high">Buxheti më i lartë</option>
                <option value="budget_low">Buxheti më i ulët</option>
              </select>

              {}
              <select
                value={limit}
                onChange={async (e) => {
                  const v = Number(e.target.value) || 10;
                  setLimit(v);
                  setPage(1);
                  await load({ limit: v, page: 1 });
                }}
                className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-300"
                title="Sa rezultate"
              >
                <option value={10}>10 rezultate</option>
                <option value={20}>20 rezultate</option>
                <option value={50}>50 rezultate</option>
              </select>

              <button
                onClick={onReset}
                className="px-5 py-2 rounded-full border border-green-700 text-green-800 hover:bg-green-50 transition"
                type="button"
              >
                Pastro
              </button>

              <button
                onClick={onSearch}
                className="px-5 py-2 rounded-full bg-green-700 text-white hover:bg-green-800 transition"
                type="button"
              >
                Kërko
              </button>
            </div>
          </div>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && items.length === 0 && !err && <EmptyState onReset={onReset} />}

          {!loading &&
            items.map((g) => (
              <div key={g.id} className="bg-white rounded-3xl shadow-md p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-green-900">
                        {g.title}
                      </h3>

                      {isNewGig(g.created_at) && (
                        <span className="text-[11px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-900 font-semibold">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      {g.category || "—"} • {g.location || "—"} •{" "}
                      <span className="font-semibold text-green-800">
                        {g.budget != null ? `${g.budget} €` : "Buxheti: —"}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-900">
                    {String(g.status || "").toLowerCase() === "closed"
                      ? "mbyllur"
                      : "hapur"}
                  </span>
                </div>

                <p className="text-gray-700 mt-4 line-clamp-3">
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

        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-4 mt-10 pb-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-full border disabled:opacity-50"
            >
              Para
            </button>
            <div className="text-sm text-gray-700">
              Faqja {page} / {totalPages}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-full border disabled:opacity-50"
            >
              Tjetër
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
