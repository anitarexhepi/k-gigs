const Gig = require("../models/Gig.model");

class GigService {
  static async list(query) {
    return Gig.findAll(query);
  }

  static async getById(id) {
    const gig = await Gig.findById(id);
    if (!gig) {
      const err = new Error("Gig not found");
      err.statusCode = 404;
      throw err;
    }
    return gig;
  }

  static async meta() {
    return Gig.getMeta();
  }

  static async createGig(user, payload) {
    const role = (user?.role || "").trim().toLowerCase();

    if (role !== "punedhenes" && role !== "admin") {
      const err = new Error("Vetëm punëdhënësi mundet me postu gig");
      err.statusCode = 403;
      throw err;
    }

    const title = (payload.title || "").trim();
    if (title.length < 3) {
      const err = new Error("Titulli është i detyrueshëm");
      err.statusCode = 400;
      throw err;
    }

    const result = await Gig.create({
      user_id: user.id,
      title,
      description: (payload.description || "").trim(),
      category: (payload.category || "").trim(),
      location: (payload.location || "").trim(),
      budget: payload.budget ?? null,
      status: payload.status || "open",
    });

    return { id: result.insertId };
  }

  static async updateGig(user, gigId, payload) {
    const gig = await this.getById(gigId);

    const role = (user?.role || "").trim().toLowerCase();
    if (gig.user_id !== user.id && role !== "admin") {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }

    const allowed = ["title", "description", "category", "location", "budget", "status"];
    const data = {};
    for (const k of allowed) {
      if (payload[k] !== undefined) data[k] = payload[k];
    }

    if (Object.keys(data).length === 0) {
      const err = new Error("Nothing to update");
      err.statusCode = 400;
      throw err;
    }

    await Gig.update(gigId, data);
    return { success: true };
  }

  static async deleteGig(user, gigId) {
    const gig = await this.getById(gigId);

    const role = (user?.role || "").trim().toLowerCase();
    if (gig.user_id !== user.id && role !== "admin") {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }

    await Gig.delete(gigId);
    return { success: true };
  }
}

module.exports = GigService;
