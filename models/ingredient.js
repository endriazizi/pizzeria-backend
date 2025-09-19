const db = require('../config/db');
module.exports = {
  listAll: async () => { const [rows] = await db.execute('SELECT * FROM ingredients'); return rows; },
  findById: async (id) => { const [rows] = await db.execute('SELECT * FROM ingredients WHERE id = ?', [id]); return rows[0]; }
};
