const pool = require('../config/db');

class User {
 

  static async create({ first_name, last_name, email, password, phone, city, role }) {
    const sql = `
      INSERT INTO users 
      (first_name, last_name, email, password, phone, city, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      first_name,
      last_name,
      email,
      password,
      phone,
      city,
      role
    ]);
    return result;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
  }

  static async findById(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  static async update(id, data) {
    if (!data || Object.keys(data).length === 0) {
      return { affectedRows: 0 };
    }

    const fields = [];
    const values = [];

    for (let key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.execute(sql, values);
    return result;
  }

  static async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result;
  }

 
  static async countAll() {
    const sql = `SELECT COUNT(*) AS total FROM users`;
    const [rows] = await pool.execute(sql);
    return rows[0].total;
  }


  static async findAll() {
    const sql = `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        role,
        is_active
      FROM users
      ORDER BY id DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  }


  static async setActive(id, isActive) {
    const sql = `UPDATE users SET is_active = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [isActive ? 1 : 0, id]);
    return result;
  }
}

module.exports = User;
