const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const logger = require('./utils/logger'); // Winston
const db = require('./config/db'); // Connessione MySQL

const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Morgan -> Winston con icone
app.use(
  morgan('combined', {
    stream: {
      write: (msg) => logger.info(`📡 HTTP Request: ${msg.trim()}`),
    },
  })
);

// Middleware per log dettagliato delle richieste
app.use((req, res, next) => {
  logger.info(
    `➡️ ${req.method} ${req.url} | Body: ${JSON.stringify(
      req.body
    )} | Query: ${JSON.stringify(req.query)}`
  );
  next();
});

// Routes
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/order_items', orderItemRoutes);
app.use('/api/v1/auth', authRoutes);

// Option 1: direttamente in server.js
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    message: 'Server is alive 🚀',
  });
});

// Error handler globale
app.use((err, req, res, next) => {
  logger.error(`❌ Errore: ${err.message}`);
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Connessione al DB con logging
console.log(`💾 Connessione al DB riuscita! Host: ${process.env.DB_HOST}, User: ${process.env.DB_USER}, Database: ${process.env.DB_NAME}, Database: ${process.env.DB_PASSWORD}`);
(async () => {
  try {
    const connection = await db.getConnection();
    logger.info(
      `💾 Connessione al DB riuscita! Host: ${process.env.DB_HOST}, User: ${process.env.DB_USER}, Database: ${process.env.DB_NAME}`
    );
    // ⚠️ Evita di loggare password in produzione!
    connection.release();
  } catch (err) {
    logger.error(`❌ Errore connessione DB: ${err.message}`);
  }
})();

// Avvio server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
