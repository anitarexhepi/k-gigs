const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function getAuthHeaders(isJson = true) {
  const token = localStorage.getItem("token");
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse(res) {
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Ndodhi një gabim");
  }
  return data;
}

export async function fetchMyCv() {
  const res = await fetch(`${API_BASE}/api/cv`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
}

export async function saveMyCv(payload) {
  const res = await fetch(`${API_BASE}/api/cv`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function fetchMyApplications() {
  const res = await fetch(`${API_BASE}/api/applications/me`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
}

export async function applyToGig(payload) {
  const res = await fetch(`${API_BASE}/api/applications`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}