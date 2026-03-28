const GigService = require("../services/gig.service");

exports.listGigs = async (req, res, next) => {
  try {
    const data = await GigService.list(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getGig = async (req, res, next) => {
  try {
    const gig = await GigService.getById(req.params.id);
    res.json({ success: true, gig });
  } catch (err) {
    next(err);
  }
};

exports.getMeta = async (req, res, next) => {
  try {
    const data = await GigService.meta();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.createGig = async (req, res, next) => {
  try {
    const created = await GigService.createGig(req.user, req.body);
    res.status(201).json({ success: true, ...created });
  } catch (err) {
    next(err);
  }
};

exports.updateGig = async (req, res, next) => {
  try {
    const out = await GigService.updateGig(req.user, req.params.id, req.body);
    res.json(out);
  } catch (err) {
    next(err);
  }
};

exports.deleteGig = async (req, res, next) => {
  try {
    const out = await GigService.deleteGig(req.user, req.params.id);
    res.json(out);
  } catch (err) {
    next(err);
  }
};

exports.getMyGigs = async (req, res, next) => {
  try {
    const data = await GigService.getMyGigs(req.user);
    res.json({ success: true, gigs: data });
  } catch (err) {
    next(err);
  }
};