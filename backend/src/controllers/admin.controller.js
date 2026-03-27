const AdminService = require("../services/admin.service");

class AdminController {
  static async getOverview(req, res) {
    try {
      const data = await AdminService.getOverview();
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Gabim te overview",
      });
    }
  }

  static async getUsers(req, res) {
    try {
      const data = await AdminService.getUsers();
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Gabim te users",
      });
    }
  }

  static async setUserActive(req, res) {
    try {
      const id = Number(req.params.id);
      const { active } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID e pavlefshme",
        });
      }

      await AdminService.setUserActive(id, active);

      return res.json({
        success: true,
        message: `User u ${active ? "aktivizua" : "deaktivizua"} me sukses`,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Gabim te ndryshimi i statusit",
      });
    }
  }

  static async createUser(req, res) {
    try {
      const data = await AdminService.createUser(req.body);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Gabim te krijimi i user",
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID e pavlefshme",
        });
      }

      const result = await AdminService.updateUser(id, data);

      return res.json({
        success: true,
        data: result,
        message: "User u përditësua me sukses",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Gabim te update user",
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = Number(req.params.id);
      await AdminService.deleteUser(id);

      return res.json({
        success: true,
        message: "User u fshi me sukses",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Gabim te fshirja e user",
      });
    }
  }
}

module.exports = AdminController;