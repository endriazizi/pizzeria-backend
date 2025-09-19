const db = require('../config/db');
module.exports = {
  create: async (data) => { const [result] = await db.execute('INSERT INTO order_items (order_id, product_id, quantity, base_price) VALUES (?, ?, ?, ?)', [data.order_id, data.product_id, data.quantity, data.base_price]); return { order_item_id: result.insertId, ...data }; },
  findByOrder: async (order_id) => { const [rows] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [order_id]); return rows; }
};
