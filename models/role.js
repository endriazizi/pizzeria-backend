const db = require('../config/db');
module.exports = {
  listAll: async () => { const [rows] = await db.execute('SELECT * FROM roles'); return rows; },
  findById: async (id) => { const [rows] = await db.execute('SELECT * FROM roles WHERE id = ?', [id]); return rows[0]; }
};
