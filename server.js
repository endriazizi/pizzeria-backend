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
app.use(cors({
  origin: 'https://dev.endriazizi.com', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// // Updated CORS configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       'http://localhost:8100',
//       'http://localhost',
//       'capacitor://localhost',
//       'http://localhost:8080',
//       'http://dev.endriazizi.com',
//       'https://dev.endriazizi.com',
//       undefined
//     ];

//     const isAllowed = !origin || allowedOrigins.includes(origin);
//     callback(null, isAllowed);
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   credentials: true
// };

// // Apply middleware in this order
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight for all routes

// // Handle OPTIONS for API routes specifically
// app.options('/api/v1/*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });

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