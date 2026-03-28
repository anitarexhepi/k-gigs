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

  const payload = {
    full_name: data.full_name?.trim() || "",
    bio: data.bio?.trim() || "",
    skills: data.skills?.trim() || "",
    experience: data.experience?.trim() || "",
    education: data.education?.trim() || "",
    phone: data.phone?.trim() || "",
    city: data.city?.trim() || "",
  };

  const existing = await CV.findByUserId(userId);

  if (!existing) {
    return CV.create({
      user_id: userId,
      ...payload,
      file_path: "",
      extracted_text: null,
    });
  }

  await CV.updateByUserId(userId, payload);
  return CV.findByUserId(userId);
};