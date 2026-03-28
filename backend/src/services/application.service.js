const Application = require("../models/Application.model");
const Gig = require("../models/Gig.model");

exports.apply = async ({ gig_id, user_id, cover_letter }) => {
  const gig = await Gig.findById(gig_id);

  if (!gig) {
    const e = new Error("Gig not found");
    e.statusCode = 404;
    throw e;
  }

  if ((gig.status || "").toLowerCase() !== "open") {
    const e = new Error("Nuk mund të aplikoni në një gig të mbyllur");
    e.statusCode = 400;
    throw e;
  }

  if (Number(gig.user_id) === Number(user_id)) {
    const e = new Error("Nuk mund të aplikoni në gig-un tuaj");
    e.statusCode = 400;
    throw e;
  }

  const exists = await Application.findByGigAndUser(gig_id, user_id);
  if (exists) {
    const e = new Error("You already applied to this gig");
    e.statusCode = 409;
    throw e;
  }

  return Application.create({
    gig_id,
    user_id,
    cover_letter: cover_letter || null,
  });
};

exports.listMine = async (user_id) => {
  return Application.listByUser(user_id);
};

exports.listByGig = async (gig_id) => {
  return Application.listByGig(gig_id);
};

exports.updateMine = async (id, user_id, cover_letter) => {
  const application = await Application.findById(id);

  if (!application) {
    const e = new Error("Application not found");
    e.statusCode = 404;
    throw e;
  }

  if (Number(application.user_id) !== Number(user_id)) {
    const e = new Error("Nuk keni të drejtë ta përditësoni këtë aplikim");
    e.statusCode = 403;
    throw e;
  }

  if ((application.status || "").toLowerCase() !== "pending") {
    const e = new Error("Vetëm aplikimet pending mund të përditësohen");
    e.statusCode = 400;
    throw e;
  }

  const updated = await Application.updateMine(id, cover_letter || "");

  if (!updated) {
    const e = new Error("Application not found");
    e.statusCode = 404;
    throw e;
  }

  return updated;
};

exports.deleteMine = async (id, user_id) => {
  const application = await Application.findById(id);

  if (!application) {
    const e = new Error("Application not found");
    e.statusCode = 404;
    throw e;
  }

  if (Number(application.user_id) !== Number(user_id)) {
    const e = new Error("Nuk keni të drejtë ta fshini këtë aplikim");
    e.statusCode = 403;
    throw e;
  }

  if ((application.status || "").toLowerCase() !== "pending") {
    const e = new Error("Vetëm aplikimet pending mund të fshihen");
    e.statusCode = 400;
    throw e;
  }

  const deleted = await Application.deleteMine(id);

  if (!deleted) {
    const e = new Error("Application not found");
    e.statusCode = 404;
    throw e;
  }

  return { success: true };
};

exports.updateStatus = async (id, status) => {
  const allowedStatuses = ["pending", "accepted", "rejected"];

  if (!allowedStatuses.includes((status || "").toLowerCase())) {
    const e = new Error("Status invalid");
    e.statusCode = 400;
    throw e;
  }

  const updated = await Application.updateStatus(id, status);
  if (!updated) {
    const e = new Error("Application not found");
    e.statusCode = 404;
    throw e;
  }
  return updated;
};