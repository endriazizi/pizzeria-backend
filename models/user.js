const db = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger'); // <-- import Winston

module.exports = {
  create: async (data) => {
    try {
      logger.info('Creazione utente iniziata DATA: %s', data.email);
      logger.info('Creazione utente iniziata per email: %s', data.email);
      logger.info('Creazione utente iniziata per role_id: %s', data.role_id);

      const hashed = await bcrypt.hash(data.password, 10);
      logger.info('Creazione utente iniziata per hashed: %s', hashed);

      const [result] = await db.execute(
        'INSERT INTO users (name, surname, email, password, role_id) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.surname, data.email, hashed, data.role_id]
      );

      logger.info('Utente creato con ID: %d', result.insertId);
      return {
        user_id: result.insertId,
        name: data.name,
        surname: data.surname,
        email: data.email,
        role_id: data.role_id,
      };
    } catch (err) {
      logger.error("Errore durante la creazione dell'utente: %s", err.message);
      throw err;
    }
  },

  findByEmail: async (email) => {
    try {
      logger.info('Ricerca utente per email: %s', email);
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      logger.info('Utente trovato: %s', rows.length > 0 ? 'SI' : 'NO');
      return rows[0];
    } catch (err) {
      logger.error('Errore nella ricerca per email: %s', err.message);
      throw err;
    }
  },

  findById: async (id) => {
    try {
      logger.info('Ricerca utente per ID: %d', id);
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      logger.info('Utente trovato: %s', rows.length > 0 ? 'SI' : 'NO');
      return rows[0];
    } catch (err) {
      logger.error(
        'Errore nella ricerca per ID: %d, errore: %s',
        id,
        err.message
      );
      throw err;
    }
  },
};
