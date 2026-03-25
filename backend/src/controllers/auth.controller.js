const AuthService = require('../services/auth.service');
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SECRET_KEY";

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

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token mungon",
        });
      }

      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        token: newAccessToken,
      });

    } catch (err) {
      res.status(401).json({
        success: false,
        message: "Refresh token invalid ose i skaduar",
      });
    }
  }

  static async logout(req, res) {
    try {
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


