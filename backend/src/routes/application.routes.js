const router = require("express").Router();

const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "application routes working" });
});

router.post("/", authMiddleware, applicationController.apply);


router.get("/me", authMiddleware, applicationController.listMine);


router.get("/gig/:gigId", authMiddleware, applicationController.listByGig);


router.patch("/:id/status", authMiddleware, applicationController.updateStatus);

module.exports = router;
