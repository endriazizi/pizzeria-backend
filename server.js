const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const logger = require('./utils/logger'); // Winston
const db = require('./config/db'); // Connessione MySQL

const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');
const roomsRoutes = require('./routes/room.routes');
const reservationsRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:8100',  // Ionic serve
      'http://localhost',       // Capacitor Android/iOS
      'capacitor://localhost',  // Capacitor iOS
      'http://localhost:8080', // Capacitor Android
      'http://dev.endriazizi.com', // Your production domain
      'https://dev.endriazizi.com' // HTTPS version
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('ENDRI AZIZI Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Add this if you need to send cookies/auth headers
};

// Apply CORS middleware

app.use(cors(corsOptions));
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

//ROOMS
app.use("/api/v1/rooms", roomsRoutes);
//RESSERVATIONS
app.use('/api/v1/reservations', reservationsRoutes);


const VERSIONE = process.env.VERSIONE || 0.01;


// Option 1: direttamente in server.js
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    //environment: process.env.NODE_ENV || 'development',
    message: `Server is alive 🚀 ${VERSIONE}`
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
      `💾 Connessione al DB riuscita! Host: ${process.env.DB_HOST}, ${process.env.DB_USER}, Database: ${process.env.DB_NAME} Host: ${process.env.DB_PORT}, Password: ${process.env.DB_PASSWORD}`
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
  logger.info(`Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
