const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SECRET_KEY";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
