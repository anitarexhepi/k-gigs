const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SECRET_KEY";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "YOUR_REFRESH_SECRET";

class AuthService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
  }

  static async signup({ first_name, last_name, email, password, phone, city, role }) {
    email = (email || "").trim().toLowerCase();
    role = (role || "").trim().toLowerCase();

    first_name = (first_name || "").trim();
    last_name = (last_name || "").trim();
    phone = (phone || "").trim();
    city = (city || "").trim();

    if (!first_name) throw new Error("first_name eshte i detyrueshem");
    if (!last_name) throw new Error("last_name eshte i detyrueshem");
    if (!phone) throw new Error("phone eshte i detyrueshem");
    if (!city) throw new Error("city eshte i detyrueshem");
    if (!email || !password) throw new Error("Email dhe password jane te detyrueshme");

    if (!role) role = "freelancer";
    if (!["freelancer", "punedhenes"].includes(role)) {
      throw new Error("Role i pavlefshem");
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error("Emaili ekziston");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      city,
      role,
      is_active: 1,
    });

    return {
      first_name,
      last_name,
      email,
      phone,
      city,
      role,
    };
  }

  static async login({ email, password }) {
    email = (email || "").trim().toLowerCase();
    password = (password || "").trim();

    if (!email || !password) {
      throw new Error("Email dhe password jane te detyrueshme");
    }

    if (email === "admin@kgigs.com" && password === "admin1234") {
      const payload = { id: 0, role: "admin" };
      const token = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return {
        token,
        refreshToken,
        user: {
          id: 0,
          first_name: "Admin",
          role: "admin",
        },
      };
    }

    const user = await User.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (Number(user.is_active) !== 1) {
      throw new Error("Llogaria juaj eshte deaktivizuar");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Fjalekalimi gabim");

    const role = (user.role || "").trim().toLowerCase();
    if (!["freelancer", "punedhenes"].includes(role)) {
      throw new Error("Role i pavlefshem");
    }

    const payload = { id: user.id, role };
    const token = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await User.updateRefreshToken(user.id, refreshToken);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        first_name: user.first_name,
        role,
      },
    };
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token mungon");
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      throw new Error("Refresh token invalid ose i skaduar");
    }

    if (decoded.id === 0 && decoded.role === "admin") {
      const token = this.generateAccessToken({ id: 0, role: "admin" });
      const newRefreshToken = this.generateRefreshToken({ id: 0, role: "admin" });

      return {
        token,
        refreshToken: newRefreshToken,
      };
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    if (!user.refresh_token || user.refresh_token !== refreshToken) {
      throw new Error("Refresh token nuk perputhet");
    }

    const payload = { id: user.id, role: user.role };
    const token = this.generateAccessToken(payload);
    const newRefreshToken = this.generateRefreshToken(payload);

    await User.updateRefreshToken(user.id, newRefreshToken);

    return {
      token,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(userId, refreshToken) {
    if (!refreshToken) return true;

    let decoded = null;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      return true;
    }

    if (decoded.id === 0) return true;

    const idToClear = userId || decoded.id;
    await User.updateRefreshToken(idToClear, null);
    return true;
  }
}

module.exports = AuthService;