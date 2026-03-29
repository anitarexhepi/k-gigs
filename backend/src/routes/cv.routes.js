const router = require("express").Router();
const cvController = require("../controllers/cv.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "cv routes working" });
});

router.get("/", authMiddleware, cvController.getMyCv);
router.post("/", authMiddleware, cvController.createOrUpdateMyCv);
router.delete("/", authMiddleware, cvController.deleteMyCv);

module.exports = router;