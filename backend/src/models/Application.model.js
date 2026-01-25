const pool = require("../config/db");

class Application {
  static async findByGigAndUser(gig_id, user_id) {
    const [rows] = await pool.execute(
      "SELECT * FROM applications WHERE gig_id = ? AND user_id = ? LIMIT 1",
      [gig_id, user_id]
    );
    return rows[0];
  }

  static async create({ gig_id, user_id, cover_letter }) {
   
    const [result] = await pool.execute(
      "INSERT INTO applications (gig_id, user_id, cover_letter, status) VALUES (?, ?, ?, ?)",
      [gig_id, user_id, cover_letter, "pending"]
    );
    const [rows] = await pool.execute("SELECT * FROM applications WHERE id = ?", [result.insertId]);
    return rows[0];
  }

  static async listByUser(user_id) {
    const [rows] = await pool.execute(
      `SELECT a.*, g.title AS gig_title
       FROM applications a
       LEFT JOIN gigs g ON g.id = a.gig_id
       WHERE a.user_id = ?
       ORDER BY a.id DESC`,
      [user_id]
    );
    return rows;
  }

  static async listByGig(gig_id) {
    const [rows] = await pool.execute(
      `SELECT a.*, u.email AS user_email
       FROM applications a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.gig_id = ?
       ORDER BY a.id DESC`,
      [gig_id]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );
    if (result.affectedRows === 0) return null;

    const [rows] = await pool.execute("SELECT * FROM applications WHERE id = ?", [id]);
    return rows[0];
  }
}

module.exports = Application;
