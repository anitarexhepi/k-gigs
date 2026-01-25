const CV = require("../models/CV.model");

exports.getByUserId = async (userId) => {
  return CV.findByUserId(userId);
};

exports.createOrUpdate = async (userId, data) => {
  
  if (!data.full_name || String(data.full_name).trim().length < 2) {
    const e = new Error("full_name is required");
    e.statusCode = 400;
    throw e;
  }

  const existing = await CV.findByUserId(userId);

  if (!existing) {
    return CV.create({ user_id: userId, ...data });
  }

  await CV.updateByUserId(userId, data);
  return CV.findByUserId(userId);
};
