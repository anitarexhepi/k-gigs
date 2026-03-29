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
router.post(
  "/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  AdminController.createUser
);

router.put(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  AdminController.updateUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  AdminController.deleteUser
);

router.get(
  "/messages",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json(require("../routes/contact.routes").messages || []);
  }
);


module.exports = router;
