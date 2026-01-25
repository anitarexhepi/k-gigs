module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = (req.user?.role || "").trim().toLowerCase();
    const allowed = allowedRoles.map(r => (r || "").trim().toLowerCase());

    if (!role) {
      return res.status(401).json({ success: false, message: "No role in token" });
    }

    if (!allowed.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: insufficient role (${role})`,
        allowedRoles: allowed
      });
    }

    next();
  };
};
