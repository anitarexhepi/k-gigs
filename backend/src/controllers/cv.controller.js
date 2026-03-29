const cvService = require("../services/cv.service");

exports.getMyCv = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cv = await cvService.getByUserId(userId);
    res.json({ success: true, data: cv || null });
  } catch (err) {
    next(err);
  }
};

exports.createOrUpdateMyCv = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = {
      full_name: req.body.full_name,
      bio: req.body.bio,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
      phone: req.body.phone,
      city: req.body.city,
    };

    const saved = await cvService.createOrUpdate(userId, data);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};

exports.deleteMyCv = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await cvService.deleteByUserId(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};