require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Start HTTP Listener
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`[GramaCare Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[GramaCare Backend] Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Fatal] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`[Fatal] Server initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
