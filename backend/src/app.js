const path = require('path');
const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { successResponse } = require('./utils/apiResponse');

// Route imports
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicalReportRoutes = require('./routes/medicalReportRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

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

// Protected uploads folder access
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reports', medicalReportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
