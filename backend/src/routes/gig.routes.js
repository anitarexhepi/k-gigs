const router = require("express").Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const gigController = require("../controllers/gig.controller");

router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "gig routes working" });
});

router.get("/", gigController.listGigs);
router.get("/:id", gigController.getGig);

router.post("/", auth, role(["punedhenes"]), gigController.createGig);

router.put("/:id", auth, gigController.updateGig);
router.delete("/:id", auth, gigController.deleteGig);

module.exports = router;
