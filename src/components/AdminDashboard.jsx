import React, { useEffect, useMemo, useState } from "react";

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
          json?.message || (isEditing ? "Update failed" : "Create failed")
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

    return {
      total,
      active,
      inactive,
      freelancers,
      punedhenes,
      admins,
      activeRate,
    };
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
    <div className="min-h-screen bg-[#eef6ec] pt-28 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#5f8367] to-[#8ab48c] text-white rounded-3xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Menaxho përdoruesit, rolet dhe statusin aktiv të llogarive në një
            vend.
          </p>
        </div>

        {err && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            {err}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-3xl shadow-md p-6 mb-8 border border-green-100">
            <h2 className="text-2xl font-bold text-[#36563c] mb-5">
              {editingUserId !== null ? "Përditëso User" : "Krijo User të Ri"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                placeholder="First name"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Last name"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                placeholder={
                  editingUserId !== null
                    ? "Password (leave empty if no change)"
                    : "Password"
                }
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <select
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="freelancer">Freelancer</option>
                <option value="punedhenes">Punëdhënës</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                className="px-5 py-3 rounded-2xl bg-[#4f6d54] text-white font-semibold hover:bg-[#3f5944] transition"
                onClick={handleSubmit}
              >
                {editingUserId !== null ? "Update User" : "Create User"}
              </button>

              <button
                className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <button
            className="px-5 py-3 rounded-2xl bg-[#4f6d54] text-white font-semibold hover:bg-[#3f5944] transition w-full sm:w-auto"
            onClick={openCreateForm}
          >
            {showForm && editingUserId === null ? "Creating..." : "Add User"}
          </button>

          <div className="text-sm text-gray-600">
            Activation rate{" "}
            <span className="font-bold text-[#36563c]">{stats.activeRate}%</span>
            {" • "}
            Admins{" "}
            <span className="font-bold text-[#36563c]">{stats.admins}</span>
          </div>

          <div className="lg:ml-auto w-full lg:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name / email / role..."
              className="w-full lg:w-80 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-sm text-gray-500">Users</p>
            <h3 className="text-3xl font-extrabold text-[#36563c] mt-2">
              {stats.total}
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-sm text-gray-500">Active Users</p>
            <h3 className="text-3xl font-extrabold text-[#36563c] mt-2">
              {stats.active}
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-sm text-gray-500">Inactive Users</p>
            <h3 className="text-3xl font-extrabold text-[#36563c] mt-2">
              {stats.inactive}
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-sm text-gray-500">Freelancers</p>
            <h3 className="text-3xl font-extrabold text-[#36563c] mt-2">
              {stats.freelancers}
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-sm text-gray-500">Punëdhënës</p>
            <h3 className="text-3xl font-extrabold text-[#36563c] mt-2">
              {stats.punedhenes}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-green-100/70 text-[#36563c]">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">ID</th>
                  <th className="px-4 py-4 text-left font-semibold">Name</th>
                  <th className="px-4 py-4 text-left font-semibold">Email</th>
                  <th className="px-4 py-4 text-left font-semibold">Phone</th>
                  <th className="px-4 py-4 text-left font-semibold">City</th>
                  <th className="px-4 py-4 text-left font-semibold">Role</th>
                  <th className="px-4 py-4 text-left font-semibold">Active</th>
                  <th className="px-4 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => {
                  const isActive = Number(u.is_active) === 1;

                  return (
                    <tr key={u.id} className="border-t hover:bg-green-50/50">
                      <td className="px-4 py-4">{u.id}</td>
                      <td className="px-4 py-4">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="px-4 py-4">{u.email}</td>
                      <td className="px-4 py-4">{u.phone || "-"}</td>
                      <td className="px-4 py-4">{u.city || "-"}</td>
                      <td className="px-4 py-4 capitalize">{u.role}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                            onClick={() => openEditForm(u)}
                          >
                            Edit
                          </button>

                          <button
                            className={`px-4 py-2 rounded-xl font-semibold transition ${
                              isActive
                                ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                : "bg-[#4f6d54] text-white hover:bg-[#3f5944]"
                            }`}
                            onClick={() => toggleActive(u.id, isActive)}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            className="px-4 py-2 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}