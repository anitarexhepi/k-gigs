const AuthService = require("../services/auth.service");

class AuthController {
  static async signup(req, res) {
    try {
      const user = await AuthService.signup(req.body);
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { token, refreshToken, user } = await AuthService.login(req.body);

      res.status(200).json({
        success: true,
        token,
        refreshToken,
        user,
      });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await AuthService.refresh(refreshToken);

      res.status(200).json({
        success: true,
        token: result.token,
        refreshToken: result.refreshToken,
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken, userId } = req.body;
      await AuthService.logout(userId, refreshToken);

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }
}

module.exports = AuthController;