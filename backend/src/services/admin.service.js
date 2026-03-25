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
    static async createUser(data) {
   
    return await User.create(data);
  }

  static async updateUser(id, data) {
    return await User.update(id, data);
  }

  static async deleteUser(id) {
    return await User.delete(id);
  }

}

module.exports = AdminService;
