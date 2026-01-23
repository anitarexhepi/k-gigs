const pool = require('./src/config/db');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('✅ DB Connected! Current Time:', rows[0].now);
  } catch (err) {
    console.error('❌ DB Test Error:', err);
  }
}

testConnection();
