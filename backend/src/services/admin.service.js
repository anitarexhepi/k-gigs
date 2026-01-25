const User = require("../models/User.model");

let Gig, Application;
try {
  Gig = require("../models/Gig.model");
} catch {}
try {
  Application = require("../models/Application.model");
} catch {}

class AdminService {
  static async getOverview() {
    const users = await User.countAll();


    const gigs = Gig?.countAll ? await Gig.countAll() : 0;
    const applications = Application?.countAll ? await Application.countAll() : 0;

    return { users, gigs, applications };
  }

  static async getUsers() {
    return await User.findAll();
  }

  static async setUserActive(id, active) {
    return await User.setActive(id, active);
  }
}

module.exports = AdminService;
