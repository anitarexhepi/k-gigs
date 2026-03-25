const AdminService = require("../services/admin.service");
const bcrypt = require("bcryptjs");

class AdminController {
  static async getOverview(req, res) {
    try {
      const data = await AdminService.getOverview();
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await AdminService.getUsers();
      return res.json({ success: true, data: users });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async setUserActive(req, res) {
    try {
      const id = Number(req.params.id);
      const { active } = req.body;

      if (!Number.isFinite(id)) {
        return res.status(400).json({ success: false, message: "Invalid user id" });
      }

      if (typeof active !== "boolean") {
        return res.status(400).json({ success: false, message: "active must be boolean" });
      }

      await AdminService.setUserActive(id, active);
      return res.json({ success: true, message: "Updated" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ✅ CREATE
  static async createUser(req, res) {
    try {
      const { first_name, last_name, email, password, phone, city, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email dhe password janë të detyrueshme",
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const result = await AdminService.createUser({
        first_name,
        last_name,
        email,
        password: hashed,
        phone,
        city,
        role: role || "freelancer",
      });

      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ✅ UPDATE
  static async updateUser(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ success: false, message: "Invalid user id" });
      }

      const { first_name, last_name, email, phone, city, role, is_active } = req.body;

      const data = { first_name, last_name, email, phone, city, role };
      if (is_active !== undefined) data.is_active = is_active ? 1 : 0;

      const result = await AdminService.updateUser(id, data);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ✅ DELETE
  static async deleteUser(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ success: false, message: "Invalid user id" });
      }

      const result = await AdminService.deleteUser(id);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = AdminController;
