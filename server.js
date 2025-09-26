const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const logger = require('./utils/logger');
const db = require('./config/db');

const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');
const roomsRoutes = require('./routes/room.routes');
const reservationsRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');

const app = express();

const allowedOrigins = [

  'http://127.0.0.1:8100',
  'http://localhost:8101',
  'http://localhost:8100',
  'http://localhost:8101',
  'http://dev.endriazizi.com',
  'https://dev.endriazizi.com',
  'http://demo.endriazizi.com',
  'https://demo.endriazizi.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Morgan logging
app.use(morgan('combined', {
  stream: {
    write: (msg) => logger.info(`📡 HTTP Request: ${msg.trim()}`),
  },
}));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(
    `➡️ ${req.method} ${req.url} | Body: ${JSON.stringify(req.body)} | Query: ${JSON.stringify(req.query)}`
  );
  next();
});

// Your routes
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/order_items', orderItemRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rooms', roomsRoutes);
// app.use('/api/v1/reservations', reservationsRoutes);
app.use('/api/v1/reservations', reservationsRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    message: `Server is alive 🚀 ${process.env.VERSIONE || '0.01'}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`❌ Errore: ${err.message}`);
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Database connection test
(async () => {
  try {
    const connection = await db.getConnection();
    logger.info(`💾 Connected to DB: ${process.env.DB_HOST}`);
    connection.release();
  } catch (err) {
    logger.error(`❌ Database connection error: ${err.message}`);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});