const AuthService = require('../services/auth.service');

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
      const { token, user } = await AuthService.login(req.body);
      res.status(200).json({ success: true, token, user });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }
}

module.exports = AuthController;


