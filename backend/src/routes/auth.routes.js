const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/signup', AuthController.signup); 
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "auth routes working" });
});

module.exports = router;