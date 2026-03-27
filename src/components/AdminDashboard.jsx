import React, { useEffect, useMemo, useState } from "react";
import "./adminDashboard.css";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  city: "",
  role: "freelancer",
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const load = async () => {
    setErr("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load users");

      setUsers(json.data || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingUserId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingUserId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingUserId(user.id);
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      city: user.city || "",
      role: user.role || "freelancer",
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      setErr("");

      const isEditing = editingUserId !== null;

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        role: form.role,
      };

      // password e dërgojmë vetëm nëse user ka shkru diçka
      if (form.password && form.password.trim()) {
        payload.password = form.password;
      }

      const url = isEditing
        ? `http://localhost:5000/api/admin/users/${editingUserId}`
        : "http://localhost:5000/api/admin/users";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          isEditing
            ? payload
            : {
                ...payload,
                password: form.password,
              }
        ),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.message ||
            (isEditing ? "Update failed" : "Create failed")
        );
      }

      alert(isEditing ? "User u përditësua!" : "User u krijua!");

      resetForm();
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("A je i sigurt që don me fshi këtë user?")) return;

    try {
      setErr("");

      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Delete failed");

      setUsers((prev) => prev.filter((u) => u.id !== id));

      if (editingUserId === id) {
        resetForm();
      }
    } catch (e) {
      setErr(e.message);
    }
  };

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
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                is_active: !current ? 1 : 0,
                active: !current ? 1 : 0,
              }
            : u
        )
      );
    } catch (e) {
      setErr(e.message);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => Number(u.is_active) === 1).length;
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
      const phone = (u.phone || "").toLowerCase();
      const city = (u.city || "").toLowerCase();

      return (
        name.includes(s) ||
        email.includes(s) ||
        role.includes(s) ||
        phone.includes(s) ||
        city.includes(s)
      );
    });
  }, [users, q]);

  return (
    <div className="adm">
      <h1 className="adm__title">Admin Dashboard</h1>

      {err && <p style={{ color: "red", marginBottom: 12 }}>{err}</p>}

      {showForm && (
        <div className="adm__form">
          <input
            className="adm__input"
            placeholder="First name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <input
            className="adm__input"
            placeholder="Last name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          <input
            className="adm__input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="adm__input"
            placeholder={
              editingUserId !== null
                ? "Password (leave empty if no change)"
                : "Password"
            }
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="adm__input"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="adm__input"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <select
            className="adm__input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="freelancer">Freelancer</option>
            <option value="punedhenes">Punëdhënës</option>
            <option value="admin">Admin</option>
          </select>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn--primary" onClick={handleSubmit}>
              {editingUserId !== null ? "Update User" : "Create User"}
            </button>

            <button className="btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <button className="btn btn--primary" onClick={openCreateForm}>
          {showForm && editingUserId === null ? "Creating..." : "Add User"}
        </button>

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

      <div className="adm__stats">
        <div className="stat">
          <div className="stat__label">Users</div>
          <div className="stat__value">{stats.total}</div>
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

      <div style={{ overflowX: "auto" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Role</th>
              <th>Active</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => {
              const isActive = Number(u.is_active) === 1;

              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.city || "-"}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`badge ${isActive ? "badge--yes" : "badge--no"}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn"
                      onClick={() => openEditForm(u)}
                    >
                      Edit
                    </button>

                    <button
                      className={`btn ${isActive ? "" : "btn--primary"}`}
                      style={{ marginLeft: 8 }}
                      onClick={() => toggleActive(u.id, isActive)}
                    >
                      {isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      className="btn btn--danger"
                      style={{ marginLeft: 8 }}
                      onClick={() => deleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: 12 }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}