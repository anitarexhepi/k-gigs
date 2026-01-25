const Application = require("../models/Application.model");

exports.apply = async ({ gig_id, user_id, cover_letter }) => {
  
  const exists = await Application.findByGigAndUser(gig_id, user_id);
  if (exists) {
    const e = new Error("You already applied to this gig");
    e.statusCode = 409;
    throw e;
  }

  return Application.create({ gig_id, user_id, cover_letter });
};

exports.listMine = async (user_id) => {
  return Application.listByUser(user_id);
};

exports.listByGig = async (gig_id) => {
  return Application.listByGig(gig_id);
};

exports.updateStatus = async (id, status) => {
  const updated = await Application.updateStatus(id, status);
  if (!updated) {
    const e = new Error("Application not found");
    e.statusCode = 404;
    throw e;
  }
  return updated;
};
