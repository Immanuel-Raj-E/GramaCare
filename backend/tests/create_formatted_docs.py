import os
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

DESKTOP_DIR = r"C:\Users\LENOVO\Desktop"
PROJECT_DOCS_DIR = r"d:\GramaCare\docs"
os.makedirs(PROJECT_DOCS_DIR, exist_ok=True)

DOCX_PATH = os.path.join(DESKTOP_DIR, "GramaCare_Section_5_2.docx")
TXT_PATH = os.path.join(DESKTOP_DIR, "GramaCare_Section_5_2.txt")
RTF_PATH = os.path.join(DESKTOP_DIR, "GramaCare_Section_5_2.rtf")

sections_data = [
    ("5.2.1 Project Structure", """gramacare/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & reconnection handler
│   │   ├── controllers/
│   │   │   ├── authController.js      # Register, login, getMe, logout
│   │   │   ├── patientController.js   # Patient profile & health summary
│   │   │   ├── doctorController.js    # Doctor profile, queue & patient directory
│   │   │   ├── appointmentController.js # Booking, conflict prevention & status transitions
│   │   │   ├── medicalRecordController.js # Clinical EHR note creation & history
│   │   │   ├── prescriptionController.js # Multi-medicine digital Rx generator
│   │   │   ├── medicalReportController.js # Multer file upload & report viewing
│   │   │   ├── messageController.js   # Doctor-patient consultative chat
│   │   │   ├── notificationController.js # Event alerts & read status updates
│   │   │   └── adminController.js     # Platform analytics, doctor audits & user toggles
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT token extraction & verification (protect)
│   │   │   ├── roleMiddleware.js      # Role-based access control (authorize)
│   │   │   └── errorMiddleware.js     # Centralized 404 & error handlers
│   │   ├── models/
│   │   │   ├── User.js, Patient.js, Doctor.js, Appointment.js,
│   │   │   ├── MedicalRecord.js, Prescription.js, MedicalReport.js,
│   │   │   └── Message.js, Notification.js
│   │   ├── routes/                    # Express modular route definitions
│   │   ├── services/                  # Notification & auxiliary business logic
│   │   ├── utils/
│   │   │   ├── apiResponse.js         # Centralized success/error JSON wrappers
│   │   │   ├── generateToken.js       # Signed JWT generator
│   │   │   ├── seedAdmin.js           # Default platform admin seeder
│   │   │   └── seedDemoData.js        # Verified doctor & rural patient demo seeders
│   │   ├── app.js                     # Express middleware & route mounting
│   │   └── server.js                  # HTTP server bootstrap & DB initialization
│   ├── tests/                         # Automated test suites
│   ├── uploads/reports/               # Local binary storage for lab report files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/common/         # Navbar, Footer, UI Cards
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global session provider & demo auto-login
│   │   ├── hooks/
│   │   │   └── useAuth.js             # AuthContext consumer hook
│   │   ├── layouts/
│   │   │   ├── PatientLayout.jsx      # Patient portal sidebar & shell
│   │   │   ├── DoctorLayout.jsx       # Doctor clinical workspace sidebar
│   │   │   └── AdminLayout.jsx        # Admin governance console sidebar
│   │   ├── pages/
│   │   │   ├── public/                # LandingPage, Login, Register, Unauthorized
│   │   │   ├── patient/               # Dashboard, Appointments, Records, Rx, Reports, Chat
│   │   │   ├── doctor/                # Dashboard, Queue, Patients, EHR, Prescriptions, Timings
│   │   │   └── admin/                 # Overview Stats, Doctor Verification, User Directory
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx          # Declarative React Router v7 configuration
│   │   │   └── ProtectedRoute.jsx     # Route guard wrapper
│   │   ├── services/
│   │   │   ├── api.js                 # Centralized Axios client with JWT interceptors
│   │   │   ├── authService.js, patientService.js, doctorService.js, adminService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md"""),

    ("5.2.2 Package Installation & Verified Versions", """The platform is built on Node.js (v24.8.0) using production-grade libraries without bloated third-party dependencies:

Backend Dependencies (backend/package.json):
npm install express@^5.2.1 mongoose@^9.10.3 dotenv@^18.0.5 cors@^2.8.6 jsonwebtoken@^9.0.3 bcryptjs@^3.0.3 multer@^2.4.0
npm install --save-dev nodemon@^3.1.14

Frontend Dependencies (frontend/package.json):
npm create vite@latest frontend -- --template react
cd frontend
npm install axios@^1.20.0 react-router-dom@^7.18.4 lucide-react@^1.49.0
npm install --save-dev tailwindcss@^3.4.19 postcss@^8.5.28 autoprefixer@^10.6.1
npx tailwindcss init -p"""),

    ("5.2.3 Database Connection (backend/src/config/db.js)", """// MongoDB connection & reconnection lifecycle handler
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gramacare';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection lost. Attempting reconnection...');
});

module.exports = connectDB;"""),

    ("5.2.4 Environment Variables (.env.example)", """# Backend Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/gramacare

# JWT Authentication Configuration
JWT_SECRET=gramacare_super_secret_jwt_key_2026_rural_health
JWT_EXPIRE=7d

# Client Application URL for CORS Whitelisting
CLIENT_URL=http://localhost:5173"""),

    ("5.2.5 User Model (backend/src/models/User.js)", """// Core User Mongoose schema with automated password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Excluded from default queries for security
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);"""),

    ("5.2.6 Registration and Profile Initialization (authController.js)", """const register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'patient', ...profileFields } = req.body;

    if (!name || !email || !phone || !password) {
      return errorResponse(res, 400, 'Please provide name, email, phone, and password');
    }
    if (password.length < 8) {
      return errorResponse(res, 400, 'Password must be at least 8 characters long');
    }
    if (!['patient', 'doctor'].includes(role)) {
      return errorResponse(res, 400, 'Invalid registration role. Allowed: patient, doctor');
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return errorResponse(res, 400, 'An account with this email address already exists');
    }

    // Doctor license validation
    if (role === 'doctor') {
      const { licenseNumber, specialization, qualification, hospitalOrClinic } = profileFields;
      if (!licenseNumber || !specialization || !qualification || !hospitalOrClinic) {
        return errorResponse(res, 400, 'Doctor registration requires license, specialization, qualification, and clinic');
      }
      if (await Doctor.findOne({ licenseNumber })) {
        return errorResponse(res, 400, 'A doctor account with this license number already exists');
      }
    }

    const user = await User.create({
      name, email: normalizedEmail, phone, password, role, isActive: true
    });

    // Create role-specific profile
    let profile = null;
    if (role === 'patient') {
      profile = await Patient.create({
        userId: user._id,
        dateOfBirth: profileFields.dateOfBirth || null,
        gender: profileFields.gender || 'male',
        bloodGroup: profileFields.bloodGroup || 'Unknown',
        address: profileFields.address || {}
      });
    } else if (role === 'doctor') {
      profile = await Doctor.create({
        userId: user._id,
        specialization: profileFields.specialization,
        qualification: profileFields.qualification,
        licenseNumber: profileFields.licenseNumber,
        hospitalOrClinic: profileFields.hospitalOrClinic,
        approvalStatus: 'pending' // Mandatory: Doctors require admin approval
      });
    }

    const token = generateToken(user._id, user.role);
    return successResponse(res, 201, 'Registration successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      profile,
      token
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("5.2.7 Login & JWT Issuance (authController.js)", """const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide both email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 401, 'Invalid email or password');
    }
    if (!user.isActive) {
      return errorResponse(res, 403, 'Account deactivated. Please contact administrator.');
    }

    let profile = user.role === 'patient'
      ? await Patient.findOne({ userId: user._id })
      : await Doctor.findOne({ userId: user._id });

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, 'Login successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      profile,
      token
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("5.2.8 Authentication & Role Middleware (authMiddleware.js & roleMiddleware.js)", """// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach verified user without password hash
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return errorResponse(res, 401, 'User account no longer exists');
      if (!user.isActive) return errorResponse(res, 403, 'User account is suspended');

      req.user = user;
      return next();
    } catch {
      return errorResponse(res, 401, 'Not authorized, token verification failed');
    }
  }
  return errorResponse(res, 401, 'Not authorized, no bearer token provided');
};

// backend/src/middleware/roleMiddleware.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Access denied: role '${req.user?.role}' is unauthorized`);
    }
    next();
  };
};

module.exports = { protect, authorize };"""),

    ("5.2.9 CRUD API Pattern with Conflict Prevention (appointmentController.js)", """const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // 1. Resolve patient profile from auth identity (prevents client spoofing)
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return errorResponse(res, 404, 'Patient profile not found');

    // 2. Validate doctor exists and is administratively approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.approvalStatus !== 'approved') {
      return errorResponse(res, 400, 'Appointments can only be booked with verified doctors');
    }

    // 3. Conflict Prevention: Ensure slot is not double-booked
    const parsedDate = new Date(appointmentDate);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const existingConflict = await Appointment.findOne({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      appointmentTime: appointmentTime.trim(),
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingConflict) {
      return errorResponse(res, 409, 'Doctor is already booked at this time slot');
    }

    // 4. Create appointment record
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate: parsedDate,
      appointmentTime: appointmentTime.trim(),
      reason,
      status: 'pending'
    });

    return successResponse(res, 201, 'Appointment request submitted', appointment);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("5.2.10 Express Application & Server Bootstrap (app.js & server.js)", """// backend/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount Module Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/reports', require('./routes/medicalReportRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;

// backend/src/server.js
require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');
const seedDemoData = require('./utils/seedDemoData');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();    // Guarantees admin account exists
  await seedDemoData(); // Seeds initial doctors and patients for live demo
  http.createServer(app).listen(PORT, () => {
    console.log(`[GramaCare Backend] Listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('[Fatal] Server failed to start:', err.message);
  process.exit(1);
});"""),

    ("5.2.11 Frontend Axios Service & Token Interceptors (api.js)", """import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gramacare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Catch Token Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('gramacare_token');
        localStorage.removeItem('gramacare_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;"""),

    ("5.2.12 Admin Analytics Dashboard Logic (AdminDashboard.jsx)", """import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/adminService';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load platform stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div>Aggregating platform intelligence...</div>;
  const counts = data?.counts || {};

  return (
    <div>
      <h3>Total Users: {counts.totalUsers}</h3>
      <h3>Verified Doctors: {counts.approvedDoctors}</h3>
      <h3>Pending Verifications: {counts.pendingDoctors}</h3>
      <h3>Total Appointments: {counts.totalAppointments}</h3>
    </div>
  );
};

export default AdminDashboard;"""),

    ("5.2.13 Standard REST API Request & Response (POST /api/appointments)", """HTTP Request:
POST /api/appointments HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "doctorId": "670f8b1a8d432b0012e8f192",
  "appointmentDate": "2026-10-25",
  "appointmentTime": "10:30 AM",
  "reason": "Persistent dry cough and mild fever"
}

HTTP Response (201 Created):
{
  "success": true,
  "message": "Appointment request submitted",
  "data": {
    "_id": "67123fa97e0129bc4512e081",
    "patientId": "670f8b1a8d432b0012e8f185",
    "doctorId": "670f8b1a8d432b0012e8f192",
    "appointmentDate": "2026-10-25T00:00:00.000Z",
    "appointmentTime": "10:30 AM",
    "reason": "Persistent dry cough and mild fever",
    "status": "pending",
    "createdAt": "2026-10-17T14:15:00.000Z",
    "updatedAt": "2026-10-17T14:15:00.000Z"
  }
}

HTTP Response on Conflict (409 Conflict):
{
  "success": false,
  "message": "Doctor is already booked at this time slot"
}""")
]

# 1. Create DOCX (Word Document) with Times New Roman 14pt
doc = docx.Document()
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(14)

title_p = doc.add_paragraph()
title_run = title_p.add_run("CHAPTER 5: IMPLEMENTATION & CODE VERIFICATION\nGRAMACARE – RURAL HEALTHCARE MANAGEMENT PLATFORM")
title_run.font.name = 'Times New Roman'
title_run.font.size = Pt(14)
title_run.bold = True
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph()

for heading, body in sections_data:
    h_p = doc.add_paragraph()
    h_run = h_p.add_run(heading)
    h_run.font.name = 'Times New Roman'
    h_run.font.size = Pt(14)
    h_run.bold = True
    
    b_p = doc.add_paragraph()
    b_run = b_p.add_run(body)
    b_run.font.name = 'Times New Roman'
    b_run.font.size = Pt(14)
    doc.add_paragraph()

doc.save(DOCX_PATH)
doc.save(os.path.join(PROJECT_DOCS_DIR, "GramaCare_Section_5_2.docx"))
print(f"Generated Word docx: {DOCX_PATH}")

# 2. Create Plain Text file
with open(TXT_PATH, "w", encoding="utf-8") as f:
    f.write("CHAPTER 5: IMPLEMENTATION & CODE VERIFICATION\n")
    f.write("GRAMACARE - RURAL HEALTHCARE MANAGEMENT PLATFORM\n")
    f.write("Font Specification: Times New Roman, Size: 14pt\n")
    f.write("=" * 70 + "\n\n")
    for heading, body in sections_data:
        f.write(f"=== {heading} ===\n\n")
        f.write(body + "\n\n")
        f.write("-" * 70 + "\n\n")

with open(os.path.join(PROJECT_DOCS_DIR, "GramaCare_Section_5_2.txt"), "w", encoding="utf-8") as f:
    f.write(open(TXT_PATH, "r", encoding="utf-8").read())
print(f"Generated Text file: {TXT_PATH}")

# 3. Create RTF (Rich Text Format with embedded Times New Roman 14pt = \\fs28)
rtf_content = r"{\rtf1\ansi\deff0{\fonttbl{\f0 Times New Roman;}}\f0\fs28 "
rtf_content += r"\b CHAPTER 5: IMPLEMENTATION & CODE VERIFICATION\b0\line "
rtf_content += r"\b GRAMACARE - RURAL HEALTHCARE MANAGEMENT PLATFORM\b0\line\line "

for heading, body in sections_data:
    escaped_heading = heading.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")
    escaped_body = body.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}").replace("\n", "\\line ")
    rtf_content += rf"\b {escaped_heading}\b0\line\line "
    rtf_content += rf"{escaped_body}\line\line "
    rtf_content += r"----------------------------------------------------------------------\line\line "

rtf_content += r"}"

with open(RTF_PATH, "w", encoding="utf-8") as f:
    f.write(rtf_content)

with open(os.path.join(PROJECT_DOCS_DIR, "GramaCare_Section_5_2.rtf"), "w", encoding="utf-8") as f:
    f.write(rtf_content)
print(f"Generated RTF file: {RTF_PATH}")
