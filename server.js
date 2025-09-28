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

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const app = express();

const allowedOrigins = [
  'http://127.0.0.1:8100',
  'http://93.51.73.11:8100',
  'http://localhost:8100',
  'http://localhost:8101',
  'http://dev.endriazizi.com',
  'https://dev.endriazizi.com',
  'http://demo.endriazizi.com',
  'https://demo.endriazizi.com'
];

// CORS configuration

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server requests (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS policy: ${origin} not allowed`), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Handle preflight OPTIONS
app.options('*', cors());

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
    status: 'ok COGNOME',
    timestamp: new Date(),
    message: `Server is alive 🚀 ${process.env.VERSIONE || '0.02'}`
  });
});
// IP della stampante di rete 
// IP PUBBLICO 93.51.73.11 ho messo nel router ip forwarding
// const PRINTER_IP = "192.168.2.182";
const PRINTER_IP = "93.51.73.11";
const PRINTER_PORT = 9100;

app.post("/api/v1/print-reservations", async (req, res) => {
  const reservations = req.body;
  if (!Array.isArray(reservations) || reservations.length === 0) {
    return res.status(400).json({ success: false, error: "Lista prenotazioni vuota" });
  }

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${PRINTER_IP}:${PRINTER_PORT}`,
    options: { timeout: 5000 },
    width: 48, // 80mm tipico ha 48-64 caratteri per linea
    characterSet: "SLOVENIA",
    removeSpecialCharacters: false,
  });

  try {
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      console.warn("⚠️ Stampante non raggiungibile:", PRINTER_IP);
      return res.status(500).json({ success: false, error: "Stampante non raggiungibile" });
    }

    printer.clear();

    for (const resv of reservations) {
      printer.alignCenter();
      printer.bold(true);
      printer.setTextSize(2, 2); // caratteri grandi per titolo
      printer.println("📌 PRENOTAZIONE");
      printer.bold(false);
      printer.setTextSize(1, 1); // torna normale per dettagli
      printer.newLine();

      printer.alignLeft();
      printer.setTextSize(2, 2); // ringraziamento grande
      printer.println(`Nome: ${resv.user_nome}`);

      printer.println(`Cognome: ${resv.user_nome}`);
      printer.println(`#persone: ${resv.numero_persone}`);
      printer.setTextSize(1, 1); // torna normale per dettagli
      // printer.println(`Telefono: ${resv.phone}`);
      printer.println(
        `Data: ${new Date(resv.date_reservation).toLocaleDateString("it-IT", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      );
      printer.setTextSize(2, 2); // ringraziamento grande
      printer.println(`Ora: ${resv.time_reservation}`);
      printer.println(`Stanza: ${resv.room_name || resv.room_id}`);
      if (resv.occasion) printer.println(`Occasione: ${resv.occasion}`);
      if (resv.intolerances) printer.println(`Intolleranze: ${resv.intolerances}`);

      printer.newLine();
      printer.alignCenter();
      printer.setTextSize(1, 1); // torna normale per dettagli
      printer.println("Grazie per aver prenotato!");
      printer.setTextSize(1, 1); // ritorna normale
      printer.cut();
      printer.newLine();
    }

    await printer.execute();
    console.log("✅ Stampa completata con successo");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Errore stampa:", error);
    res.status(500).json({ success: false, error: error.message });
  }
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