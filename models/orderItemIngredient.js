const db = require('../config/db');
module.exports = {
  create: async (data) => { const [result] = await db.execute('INSERT INTO order_item_ingredients (order_item_id, ingredient_id, extra_price) VALUES (?, ?, ?)', [data.order_item_id, data.ingredient_id, data.extra_price || 0.0]); return { id: result.insertId, ...data }; },
  findByOrderItem: async (order_item_id) => { const [rows] = await db.execute('SELECT * FROM order_item_ingredients WHERE order_item_id = ?', [order_item_id]); return rows; }
};
