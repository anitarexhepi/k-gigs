const AdminService = require("../services/admin.service");

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
}

module.exports = AdminController;
