const applicationService = require("../services/application.service");

exports.apply = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { gig_id, cover_letter } = req.body;

    if (!gig_id) {
      return res.status(400).json({ success: false, message: "gig_id is required" });
    }

    const created = await applicationService.apply({
      gig_id,
      user_id: userId,
      cover_letter: cover_letter || null,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await applicationService.listMine(userId);
    return res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.listByGig = async (req, res, next) => {
  try {
    const gigId = Number(req.params.gigId);
    const items = await applicationService.listByGig(gigId);
    return res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

   
    if (!status) {
      return res.status(400).json({ success: false, message: "status is required" });
    }

    const updated = await applicationService.updateStatus(id, status);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
