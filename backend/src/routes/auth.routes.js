const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// POST /api/auth/signup
router.post('/signup', AuthController.signup); // ✅ must be a function

// POST /api/auth/login
router.post('/login', AuthController.login);

module.exports = router;
