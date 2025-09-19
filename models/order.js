const db = require('../config/db');

module.exports = {
  create: async (data) => {
    const [result] = await db.execute(
      'INSERT INTO orders (table_id, guest_name, guest_email, guest_phone, delivery_address, is_guest, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.table_id, data.guest_name, data.guest_email, data.guest_phone, data.delivery_address || null, data.is_guest ?? true, data.status || 'pending', data.user_id || null]
    );
    return { order_id: result.insertId, ...data };
  },
  findById: async (id) => { const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]); return rows[0]; },
  findByTable: async (table_id) => { const [rows] = await db.execute('SELECT * FROM orders WHERE table_id = ?', [table_id]); return rows; },
  assignToUser: async (order_id, user_id) => { await db.execute('UPDATE orders SET user_id = ?, is_guest = FALSE WHERE id = ?', [user_id, order_id]); return { order_id, user_id }; },
  delete: async (order_id) => { await db.execute('DELETE FROM order_items WHERE order_id = ?', [order_id]); await db.execute('DELETE FROM orders WHERE id = ?', [order_id]); return { deleted: true }; },
  listPendingGuests: async () => { const [rows] = await db.execute('SELECT * FROM orders WHERE is_guest = TRUE AND status = "pending"'); return rows; }
};
