const pool = require("../config/db");

class Gig {
  static async create({ user_id, title, description, category, location, budget, status }) {
    const sql = `
      INSERT INTO gigs (user_id, title, description, category, location, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      user_id,
      title,
      description,
      category,
      location,
      budget,
      status || "open",
    ]);

    return result;
  }

  static async findById(id) {
    const sql = `SELECT * FROM gigs WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  static async findAll({ q, category, location, status, limit = 10, page = 1 }) {
    const where = [];
    const values = [];

    if (q) {
      where.push(`(title LIKE ? OR description LIKE ?)`);
      values.push(`%${q}%`, `%${q}%`);
    }
    if (category) {
      where.push(`category = ?`);
      values.push(category);
    }
    if (location) {
      where.push(`location = ?`);
      values.push(location);
    }
    if (status) {
      where.push(`status = ?`);
      values.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 10, 50));
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const offset = (safePage - 1) * safeLimit;

    const sql = `
      SELECT * FROM gigs
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(sql, [...values, safeLimit, offset]);

    const countSql = `SELECT COUNT(*) as total FROM gigs ${whereSql}`;
    const [countRows] = await pool.execute(countSql, values);

    return {
      items: rows,
      page: safePage,
      limit: safeLimit,
      total: countRows[0]?.total || 0,
    };
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    const sql = `UPDATE gigs SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.execute(sql, values);
    return result;
  }

  static async delete(id) {
    const sql = `DELETE FROM gigs WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result;
  }
}

module.exports = Gig;
