const path = require('path');
const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { successResponse } = require('./utils/apiResponse');

const app = express();

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Protected uploads folder access will be streamed via report routes,
// but static path is ready for public static assets if needed.
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  return successResponse(res, 200, 'GramaCare API Server is online and healthy', {
    platform: 'GramaCare – Rural Healthcare Management',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Future Route Mounts will be attached here in upcoming modules

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
