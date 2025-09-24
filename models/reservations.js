const db = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.*, rm.name as room_name, rm.seats
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      ORDER BY r.date_reservation, r.time_reservation
    `);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reservations WHERE id=?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { room_id, user_name, phone, date_reservation, time_reservation, occasion, intolerances } = req.body;
    const [result] = await db.execute(`
      INSERT INTO reservations
      (room_id, user_name, phone, date_reservation, time_reservation, occasion, intolerances)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [room_id, user_name, phone, date_reservation, time_reservation, occasion, intolerances]);
    res.json({ reservation_id: result.insertId });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { room_id, user_name, phone, date_reservation, time_reservation, occasion, intolerances, status } = req.body;
    await db.execute(`
      UPDATE reservations
      SET room_id=?, user_name=?, phone=?, date_reservation=?, time_reservation=?, occasion=?, intolerances=?, status=?
      WHERE id=?
    `, [room_id, user_name, phone, date_reservation, time_reservation, occasion, intolerances, status, req.params.id]);
    res.json({ message: 'Reservation updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM reservations WHERE id=?', [req.params.id]);
    res.json({ message: 'Reservation deleted' });
  } catch (err) { next(err); }
};
