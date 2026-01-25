const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const AdminController = require("../controllers/admin.controller");


router.get(
  "/overview",
  authMiddleware,
  roleMiddleware(["admin"]),
  AdminController.getOverview
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  AdminController.getUsers
);

router.patch(
  "/users/:id/active",
  authMiddleware,
  roleMiddleware(["admin"]),
  AdminController.setUserActive
);

module.exports = router;
