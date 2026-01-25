const pool = require("../config/db");

class CV {
  static async findByUserId(user_id) {
    const [rows] = await pool.execute("SELECT * FROM cvs WHERE user_id = ? LIMIT 1", [user_id]);
    return rows[0];
  }

  static async create({ user_id, full_name, bio, skills, experience, education, phone }) {
    const [result] = await pool.execute(
      `INSERT INTO cvs (user_id, full_name, bio, skills, experience, education, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, bio, skills, experience, education, phone]
    );
    const [rows] = await pool.execute("SELECT * FROM cvs WHERE id = ?", [result.insertId]);
    return rows[0];
  }

  static async updateByUserId(user_id, data) {
    const fields = [];
    const values = [];

    for (const key of Object.keys(data)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    if (fields.length === 0) return this.findByUserId(user_id);

    values.push(user_id);
    await pool.execute(`UPDATE cvs SET ${fields.join(", ")} WHERE user_id = ?`, values);

    return this.findByUserId(user_id);
  }
}

module.exports = CV;
