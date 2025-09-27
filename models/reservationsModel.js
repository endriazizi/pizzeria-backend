const db = require('../config/db');
const logger = require('../utils/logger');

exports.fetchAll = async () => {
  const sql = `
    SELECT r.*, rm.name as room_name, rm.seats
    FROM reservations r
    JOIN rooms rm ON r.room_id = rm.id
    ORDER BY r.date_reservation, r.time_reservation
  `;
  logger.info(`📋 SQL fetchAll: ${sql}`);
  const [rows] = await db.execute(sql);
  logger.info(`✅ fetchAll returned ${rows.length} rows`);
  return rows;
};

exports.fetchById = async (id) => {
  const sql = `SELECT * FROM reservations WHERE id = ?`;
  logger.info(`📋 SQL fetchById: ${sql} | Params: [${id}]`);
  const [rows] = await db.execute(sql, [id]);
  logger.info(`✅ fetchById returned ${rows.length} row(s)`);
  return rows[0];
};

exports.insert = async (data) => {
  const { room_id, user_nome, user_cognome, phone, date_reservation, time_reservation, occasion, intolerances, status } = data;
  const sql = `
    INSERT INTO reservations
    (room_id, user_nome, user_cognome,phone, date_reservation, time_reservation, occasion, intolerances, status)
    VALUES (?, ?,?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [room_id, user_nome, user_cognome, phone, date_reservation, time_reservation, occasion, intolerances, status || 'pending'];
  logger.info(`📋 SQL insert: ${sql} | Params: ${JSON.stringify(params)}`);
  const [result] = await db.execute(sql, params);
  logger.info(`✅ insert completed, insertedId: ${result.insertId}`);
  return result.insertId;
};

exports.update = async (id, data) => {
  const { room_id, user_nome, phone, date_reservation, time_reservation, occasion, intolerances, status } = data;
  const sql = `
    UPDATE reservations
    SET room_id=?, user_nome=?, user_cognome=?,phone=?, date_reservation=?, time_reservation=?, occasion=?, intolerances=?, status=?
    WHERE id=?
  `;
  const params = [room_id, user_nome, user_cognome, phone, date_reservation, time_reservation, occasion, intolerances, status, id];
  logger.info(`📋 SQL update: ${sql} | Params: ${JSON.stringify(params)}`);
  const [result] = await db.execute(sql, params);
  logger.info(`✅ update completed, affectedRows: ${result.affectedRows}`);
};

exports.remove = async (id) => {
  const sql = `DELETE FROM reservations WHERE id = ?`;
  logger.info(`📋 SQL delete: ${sql} | Params: [${id}]`);
  const [result] = await db.execute(sql, [id]);
  logger.info(`✅ delete completed, affectedRows: ${result.affectedRows}`);
};
