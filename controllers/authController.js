// const authService = require('../services/authService');
// const logger = require('../utils/logger');

// module.exports = {
//   register: async (req, res) => {
//     try {
//       const user = await authService.register(req.body);
//       res.json(user);
//     } catch (err) {
//       logger.error(err);
//       res.status(500).json({ message: err.message });
//     }
//   },
//   login: async (req, res) => {
//     try {
//       const token = await authService.login(req.body);
//       res.json(token);
//     } catch (err) {
//       logger.error(err);
//       res.status(500).json({ message: err.message });
//     }
//   },
// };

const authService = require('../services/authService');
const logger = require('../utils/logger');

module.exports = {
  register: async (req, res) => {
    try {
      logger.info('Richiesta di registrazione utente: %s', req.body.email);
      logger.info('Richiesta di registrazione BODY: %s', req.body);

      // Log body ricevuto
      logger.info(`📩 Body ricevuto: ${JSON.stringify(req.body)}`);

      const user = await authService.register(req.body);

      logger.info(
        'Registrazione completata per utente ID: %d, email: %s',
        user.user_id,
        user.email
      );

      logger.warn("⚠️ Uno dei campi obbligatori è mancante!");
      res.json(user);
    } catch (err) {
      logger.error('Errore durante la registrazione utente: %s', err.message);
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      logger.info('Tentativo di login per email: %s', req.body.email);

      const token = await authService.login(req.body);

      logger.info('Login riuscito per email: %s', req.body.email);
      res.json(token);
    } catch (err) {
      logger.error(
        'Errore durante il login per email %s: %s',
        req.body.email,
        err.message
      );
      res.status(500).json({ message: err.message });
    }
  },
};
