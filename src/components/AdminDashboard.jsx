import React, { useEffect, useMemo, useState } from "react";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

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
   
  }, []);

  const toggleActive = async (id, current) => {
    try {
      setErr("");
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: !current }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to update user");

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !current } : u))
      );
    } catch (e) {
      setErr(e.message);
    }
  };

 
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => !!u.active).length;
    const inactive = total - active;

    const freelancers = users.filter((u) => u.role === "freelancer").length;
    const punedhenes = users.filter((u) => u.role === "punedhenes").length;
    const admins = users.filter((u) => u.role === "admin").length;

    const activeRate = total ? Math.round((active / total) * 100) : 0;

    return { total, active, inactive, freelancers, punedhenes, admins, activeRate };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;

    return users.filter((u) => {
      const name = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return name.includes(s) || email.includes(s) || role.includes(s);
    });
  }, [users, q]);

  return (
    <div className="adm">
      <h1 className="adm__title">Admin Dashboard</h1>

      {err && <p style={{ color: "red", marginBottom: 12 }}>{err}</p>}

     
      <div className="adm__stats">
        <div className="stat">
          <div className="stat__label">Users</div>
          <div className="stat__value">{overview?.users ?? stats.total}</div>
        </div>

        <div className="stat">
          <div className="stat__label">Active Users</div>
          <div className="stat__value">{stats.active}</div>
        </div>

        <div className="stat">
          <div className="stat__label">Inactive Users</div>
          <div className="stat__value">{stats.inactive}</div>
        </div>

        <div className="stat">
          <div className="stat__label">Freelancers</div>
          <div className="stat__value">{stats.freelancers}</div>
        </div>

        <div className="stat">
          <div className="stat__label">Punëdhënës</div>
          <div className="stat__value">{stats.punedhenes}</div>
        </div>
      </div>

    
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "#667085" }}>
          Activation rate: <b style={{ color: "#101828" }}>{stats.activeRate}%</b> • Admins:{" "}
          <b style={{ color: "#101828" }}>{stats.admins}</b>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name / email / role..."
            className="adm__search"
          />
        </div>
      </div>

      {!overview && users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    {u.first_name} {u.last_name}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`badge ${u.active ? "badge--yes" : "badge--no"}`}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className={`btn ${u.active ? "" : "btn--primary"}`}
                      onClick={() => toggleActive(u.id, !!u.active)}
                    >
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: 12 }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
