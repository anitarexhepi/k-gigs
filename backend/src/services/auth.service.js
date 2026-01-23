const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {

  // SIGNUP: only freelancer & punedhenes
  static async signup({ first_name, last_name, email, password, phone, city, role }) {
    // normalize role
    role = role?.trim().toLowerCase();

    if (!['freelancer', 'punedhenes'].includes(role)) {
      throw new Error('Role i pavlefshëm');
    }

    // check if email exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error('Emaili ekziston');

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      city,
      role
    });

    return { first_name, last_name, email, phone, city, role };
  }

  // LOGIN: hardcoded admin + DB users
  static async login({ email, password }) {
    // 🔹 HARD-CODED ADMIN LOGIN
    if (email === 'admin@kgigs.com' && password === 'admin1234') {
      const token = jwt.sign(
        { id: 0, role: 'admin' },
        process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
        { expiresIn: '1h' }
      );

      return {
        token,
        user: {
          id: 0,
          first_name: 'Admin',
          role: 'admin'
        }
      };
    }

    // 🔹 NORMAL DB USERS LOGIN
    const user = await User.findByEmail(email);
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Fjalëkalimi gabim');

    // only allow freelancer & punedhenes
    if (!['freelancer', 'punedhenes'].includes(user.role)) {
      throw new Error('Role i pavlefshëm');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        role: user.role
      }
    };
  }
}

module.exports = AuthService;






