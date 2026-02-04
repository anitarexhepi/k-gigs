const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.append(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function fetchGigs(params) {
  const res = await fetch(`${API_BASE}/api/gigs${buildQuery(params)}`);
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Dështoi ngarkimi i punëve");
  }
  return data;
}

export async function fetchGigById(id) {
  const res = await fetch(`${API_BASE}/api/gigs/${id}`);
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Dështoi ngarkimi i punës");
  }
  return data.gig;
}

export async function fetchGigsMeta() {
  const res = await fetch(`${API_BASE}/api/gigs/meta`);
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Dështoi ngarkimi i kategorive/qyteteve");
  }
  return data; 
}
