import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");

  const load = async () => {
    setErr("");
    try {
      const [oRes, uRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/overview", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const oJson = await oRes.json();
      const uJson = await uRes.json();

      if (!oRes.ok) throw new Error(oJson?.message || "Failed to load overview");
      if (!uRes.ok) throw new Error(uJson?.message || "Failed to load users");

      setOverview(oJson.data);
      setUsers(uJson.data || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const toggleActive = async (id, current) => {
    try {
      setErr("");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !current }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to update user");

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !current } : u))
      );
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {!overview ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
            <h3>Users</h3>
            <p>{overview.users}</p>
          </div>
          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
            <h3>Gigs</h3>
            <p>{overview.gigs}</p>
          </div>
          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
            <h3>Applications</h3>
            <p>{overview.applications}</p>
          </div>
        </div>
      )}

      <h2>Users</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                ID
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                Name
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                Email
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                Role
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                Active
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.id}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {u.first_name} {u.last_name}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.email}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.role}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {u.active ? "Yes" : "No"}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  <button onClick={() => toggleActive(u.id, !!u.active)}>
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 12 }}>
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
