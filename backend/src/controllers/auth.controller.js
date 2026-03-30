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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true në production
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}
 static async refresh(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await AuthService.refresh(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token: result.token,
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
    const refreshToken = req.cookies.refreshToken;

    await AuthService.logout(null, refreshToken);

    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh",
    });

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