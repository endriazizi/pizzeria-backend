// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// module.exports = {
//   register: (data) => User.create(data),
//   login: async (data) => {
//     const user = await User.findByEmail(data.email);
//     if (!user) throw new Error('User not found');
//     const valid = await bcrypt.compare(data.password, user.password);
//     if (!valid) throw new Error('Invalid password');
//     const token = jwt.sign({ user_id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     return { token, user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id } };
//   }
// };

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('../utils/logger'); // <-- import Winston

dotenv.config();

module.exports = {
  register: async (data) => {
    try {
      logger.info('Richiesta registrazione utente: %s', data.email);

      const user = await User.create(data);

      logger.info(
        'Utente registrato con ID: %d, email: %s',
        user.user_id,
        user.email
      );
      return user;
    } catch (err) {
      logger.error(
        'Errore registrazione utente %s: %s',
        data.email,
        err.message
      );
      throw err;
    }
  },

  login: async (data) => {
    try {
      logger.info('Tentativo login per email: %s', data.email);

      const user = await User.findByEmail(data.email);
      if (!user) {
        logger.warn('Utente non trovato: %s', data.email);
        throw new Error('User not found');
      }

      // --- LOG dei valori in chiaro (solo per debug) ---
      logger.info("Password inserita dall'utente: %s", data.password);
      logger.info('Password hash dal DB: %s', user.password);

      const valid = await bcrypt.compare(data.password, user.password);
      if (!valid) {
        logger.warn('Password non valida per utente: %s', data.email);
        throw new Error('Invalid password');
      }

      const payload = { user_id: user.id, role_id: user.role_id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      // --- LOG del payload JWT (solo per debug) ---
      logger.info(
        'Payload JWT generato per utente %s: %o',
        data.email,
        payload
      );

      logger.info('Login riuscito per utente: %s', data.email);
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
        },
      };
    } catch (err) {
      logger.error('Errore login per utente %s: %s', data.email, err.message);
      throw err;
    }
  },
};
