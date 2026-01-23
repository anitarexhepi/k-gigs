const jwt = require('jsonwebtoken');

// Secret key (ideally store in .env)
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next(); // pass control to next middleware/controller
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
