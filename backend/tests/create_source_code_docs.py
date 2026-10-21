import os
import docx
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

DESKTOP_DIR = r"C:\Users\LENOVO\Desktop"
PROJECT_DOCS_DIR = r"d:\GramaCare\docs"
os.makedirs(PROJECT_DOCS_DIR, exist_ok=True)

DOCX_PATH = os.path.join(DESKTOP_DIR, "GramaCare_Source_Code.docx")
TXT_PATH = os.path.join(DESKTOP_DIR, "GramaCare_Source_Code.txt")
RTF_PATH = os.path.join(DESKTOP_DIR, "GramaCare_Source_Code.rtf")

source_code_items = [
    ("1. Project Structure", """Project Folder Structure – GramaCare

gramacare/
│
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
│   │   │   ├── User.js
│   │   │   ├── Patient.js
│   │   │   ├── Doctor.js
│   │   │   ├── Appointment.js
│   │   │   ├── MedicalRecord.js
│   │   │   ├── Prescription.js
│   │   │   ├── MedicalReport.js
│   │   │   ├── Message.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── medicalRecordRoutes.js
│   │   │   ├── prescriptionRoutes.js
│   │   │   ├── medicalReportRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/
│   │   │   └── notificationService.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js         # Centralized success/error JSON wrappers
│   │   │   ├── generateToken.js       # Signed JWT generator
│   │   │   ├── seedAdmin.js           # Default platform admin seeder
│   │   │   └── seedDemoData.js        # Verified doctor & rural patient demo seeders
│   │   ├── app.js                     # Express middleware & route mounting
│   │   └── server.js                  # HTTP server bootstrap & DB initialization
│   ├── uploads/
│   │   └── reports/                   # Secure storage for medical reports
│   ├── .env
│   ├── package.json
│   └── tests/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global session provider & demo auto-login
    │   ├── hooks/
    │   │   └── useAuth.js             # AuthContext consumer hook
    │   ├── layouts/
    │   │   ├── PatientLayout.jsx      # Patient portal sidebar & shell
    │   │   ├── DoctorLayout.jsx       # Doctor clinical workspace sidebar
    │   │   └── AdminLayout.jsx        # Admin governance console sidebar
    │   ├── pages/
    │   │   ├── public/
    │   │   │   ├── LandingPage.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── Unauthorized.jsx
    │   │   ├── patient/
    │   │   │   ├── PatientDashboard.jsx
    │   │   │   ├── PatientAppointments.jsx
    │   │   │   ├── PatientRecords.jsx
    │   │   │   ├── PatientPrescriptions.jsx
    │   │   │   ├── PatientReports.jsx
    │   │   │   └── PatientMessages.jsx
    │   │   ├── doctor/
    │   │   │   ├── DoctorDashboard.jsx
    │   │   │   ├── DoctorAppointments.jsx
    │   │   │   ├── DoctorPatients.jsx
    │   │   │   ├── DoctorConsultation.jsx
    │   │   │   ├── DoctorPrescriptions.jsx
    │   │   │   └── DoctorMessages.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminDoctors.jsx
    │   │       ├── AdminUsers.jsx
    │   │       └── AdminAppointments.jsx
    │   ├── routes/
    │   │   ├── AppRoutes.jsx          # Declarative React Router v7 configuration
    │   │   └── ProtectedRoute.jsx     # Route guard wrapper
    │   ├── services/
    │   │   ├── api.js                 # Centralized Axios client with JWT interceptors
    │   │   ├── authService.js
    │   │   ├── patientService.js
    │   │   ├── doctorService.js
    │   │   └── adminService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── index.html"""),

    ("2. Backend Package Installation", """# Initialize backend Node.js project
npm init -y

# Install production dependencies
npm install express mongoose dotenv cors jsonwebtoken bcryptjs multer

# Install development dependency for live server auto-reloading
npm install --save-dev nodemon

# Start backend server in development mode
npm run dev"""),

    ("3. Database Connection", """// backend/src/config/db.js
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

    ("4. Environment Variables", """# backend/.env and .env.example

# Backend Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/gramacare

# JWT Authentication Configuration
JWT_SECRET=gramacare_super_secret_jwt_key_2026_rural_health
JWT_EXPIRE=7d

# Client Application URL for CORS Whitelisting
CLIENT_URL=http://localhost:5173"""),

    ("5. User Model", """// backend/src/models/User.js
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

// Encrypt password before saving using bcrypt salt
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

    ("6. Password Hashing and Registration", """// backend/src/controllers/authController.js (register)
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res) => {
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

    // Doctor specific license uniqueness check
    if (role === 'doctor') {
      const { licenseNumber, specialization, qualification, hospitalOrClinic } = profileFields;
      if (!licenseNumber || !specialization || !qualification || !hospitalOrClinic) {
        return errorResponse(res, 400, 'Doctor registration requires license, specialization, qualification, and clinic');
      }
      if (await Doctor.findOne({ licenseNumber })) {
        return errorResponse(res, 400, 'A doctor account with this license number already exists');
      }
    }

    // Password is automatically hashed via userSchema.pre('save')
    const user = await User.create({
      name, email: normalizedEmail, phone, password, role, isActive: true
    });

    // Create role-specific profile document
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

    ("7. Login and JWT Generation", """// backend/src/controllers/authController.js (login) & utils/generateToken.js
const jwt = require('jsonwebtoken');

// Token Generator Helper
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'gramacare_super_secret_jwt_key_2026_rural_health',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Login Controller
const login = async (req, res) => {
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
      return errorResponse(res, 403, 'Your account has been deactivated. Please contact administrator.');
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

    ("8. Authentication Middleware", """// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gramacare_super_secret_jwt_key_2026_rural_health');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return errorResponse(res, 401, 'User account no longer exists');
      if (!user.isActive) return errorResponse(res, 403, 'User account is suspended');

      req.user = user;
      return next();
    } catch (error) {
      return errorResponse(res, 401, 'Not authorized, token verification failed');
    }
  }
  return errorResponse(res, 401, 'Not authorized, no bearer token provided');
};

// Role-Based Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Access denied: role '${req.user?.role}' is unauthorized`);
    }
    next();
  };
};

module.exports = { protect, authorize };"""),

    ("9. Create API", """// backend/src/controllers/appointmentController.js (createAppointment)
// Demonstrates data validation, patient identity resolution, doctor verification, and double-booking prevention
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return errorResponse(res, 400, 'Please provide doctor, date, time, and reason for consultation');
    }

    // 1. Resolve patient profile strictly from auth token identity
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return errorResponse(res, 404, 'Patient profile not found');

    // 2. Validate doctor existence and approval status
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor || doctor.approvalStatus !== 'approved') {
      return errorResponse(res, 400, 'Appointments can only be booked with approved healthcare doctors');
    }

    // 3. Slot Conflict Prevention (prevents double-booking same date & time)
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
      return errorResponse(res, 409, `Doctor is already booked at ${appointmentTime} on this date`);
    }

    // 4. Create appointment in database
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate: parsedDate,
      appointmentTime: appointmentTime.trim(),
      reason,
      notes: notes || '',
      status: 'pending'
    });

    return successResponse(res, 201, 'Appointment request created successfully', appointment);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("10. Read API", """// backend/src/controllers/appointmentController.js (getAppointments & getAppointmentById)
// Enforces role-based isolation (patients only view their records, doctors only view their clinic visits)
const getAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return errorResponse(res, 404, 'Patient profile not found');
      filter.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) return errorResponse(res, 404, 'Doctor profile not found');
      filter.doctorId = doctor._id;
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: -1, appointmentTime: 1 })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } });

    return successResponse(res, 200, 'Appointments retrieved successfully', appointments);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } });

    if (!appointment) return errorResponse(res, 404, 'Appointment not found');
    return successResponse(res, 200, 'Appointment details retrieved', appointment);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("11. Update", """// backend/src/controllers/appointmentController.js (updateAppointmentStatus)
// Handles status transitions: pending -> confirmed, rejected, or completed
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status || !['confirmed', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return errorResponse(res, 400, 'Invalid appointment status');
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    // Business Rule: Cancelled appointments cannot be completed
    if (appointment.status === 'cancelled' && status === 'completed') {
      return errorResponse(res, 400, 'Cancelled appointments cannot be marked completed');
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    return successResponse(res, 200, `Appointment marked as ${status}`, appointment);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("12. Delete", """// backend/src/controllers/medicalReportController.js (deleteReport) & appointment cancel
// Deletes both the database metadata record and the physical binary file from disk
const deleteReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return errorResponse(res, 404, 'Report not found');
    }

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || !report.patientId.equals(patient._id)) {
      return errorResponse(res, 403, 'Unauthorized to delete this medical report');
    }

    // Unlink physical file from disk storage
    const filename = path.basename(report.fileUrl);
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'reports', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await MedicalReport.findByIdAndDelete(report._id);
    return successResponse(res, 200, 'Medical report deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};"""),

    ("13. Express Routes", """// backend/src/routes/appointmentRoutes.js
const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/status', protect, updateAppointmentStatus);

module.exports = router;"""),

    ("14. Main Server File", """// backend/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
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
  await seedAdmin();
  await seedDemoData();
  http.createServer(app).listen(PORT, () => {
    console.log(`[GramaCare Backend] Listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('[Fatal] Server failed to start:', err.message);
  process.exit(1);
});"""),

    ("15. React Login Component", """// frontend/src/pages/public/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { HeartPulse, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email address and password');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      const role = result.user.role;
      const redirectPath = location.state?.from?.pathname || (
        role === 'doctor' ? '/doctor/dashboard' :
        role === 'admin' ? '/admin/dashboard' :
        '/patient/dashboard'
      );
      navigate(redirectPath, { replace: true });
    } else {
      setLocalError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-6">Sign In to GramaCare</h2>
        {localError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;"""),

    ("16. Admin Dashboard Logic", """// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
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
      console.error('Failed to load admin stats:', err);
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
    <div className="grid grid-cols-4 gap-6">
      <div className="p-5 bg-white rounded-2xl border">Total Users: {counts.totalUsers}</div>
      <div className="p-5 bg-white rounded-2xl border">Verified Doctors: {counts.approvedDoctors}</div>
      <div className="p-5 bg-white rounded-2xl border">Pending Approvals: {counts.pendingDoctors}</div>
      <div className="p-5 bg-white rounded-2xl border">Total Appointments: {counts.totalAppointments}</div>
    </div>
  );
};

export default AdminDashboard;"""),

    ("17. REST API Request and Response Examples", """// 1. Appointment Booking (Patient)
HTTP Request:
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
  "message": "Appointment request created successfully",
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

// 2. Conflict Error Response (409 Conflict):
{
  "success": false,
  "message": "Doctor is already booked at 10:30 AM on this date"
}

// 3. Status Transition Update (Doctor)
HTTP Request:
PUT /api/appointments/67123fa97e0129bc4512e081/status HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Appointment slot confirmed. Please bring previous prescriptions."
}

HTTP Response (200 OK):
{
  "success": true,
  "message": "Appointment marked as confirmed",
  "data": {
    "_id": "67123fa97e0129bc4512e081",
    "status": "confirmed",
    "notes": "Appointment slot confirmed. Please bring previous prescriptions."
  }
}""")
]

# 1. Create DOCX with Times New Roman 14pt throughout
doc = docx.Document()
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(14)

title_p = doc.add_paragraph()
title_run = title_p.add_run("SOURCE CODE IMPLEMENTATION\nGRAMACARE – RURAL HEALTHCARE MANAGEMENT PLATFORM")
title_run.font.name = 'Times New Roman'
title_run.font.size = Pt(14)
title_run.bold = True
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph()

for heading, body in source_code_items:
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
doc.save(os.path.join(PROJECT_DOCS_DIR, "GramaCare_Source_Code.docx"))
print(f"Generated Word docx: {DOCX_PATH}")

# 2. Create Plain Text file
with open(TXT_PATH, "w", encoding="utf-8") as f:
    f.write("SOURCE CODE IMPLEMENTATION\n")
    f.write("GRAMACARE - RURAL HEALTHCARE MANAGEMENT PLATFORM\n")
    f.write("Font Specification: Times New Roman, Size: 14pt\n")
    f.write("=" * 70 + "\n\n")
    for heading, body in source_code_items:
        f.write(f"=== {heading} ===\n\n")
        f.write(body + "\n\n")
        f.write("-" * 70 + "\n\n")

with open(os.path.join(PROJECT_DOCS_DIR, "GramaCare_Source_Code.txt"), "w", encoding="utf-8") as f:
    f.write(open(TXT_PATH, "r", encoding="utf-8").read())
print(f"Generated Text file: {TXT_PATH}")

# 3. Create RTF with Times New Roman 14pt
rtf_content = r"{\rtf1\ansi\deff0{\fonttbl{\f0 Times New Roman;}}\f0\fs28 "
rtf_content += r"\b SOURCE CODE IMPLEMENTATION\b0\line "
rtf_content += r"\b GRAMACARE - RURAL HEALTHCARE MANAGEMENT PLATFORM\b0\line\line "

for heading, body in source_code_items:
    escaped_heading = heading.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")
    escaped_body = body.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}").replace("\n", "\\line ")
    rtf_content += rf"\b {escaped_heading}\b0\line\line "
    rtf_content += rf"{escaped_body}\line\line "
    rtf_content += r"----------------------------------------------------------------------\line\line "

rtf_content += r"}"

with open(RTF_PATH, "w", encoding="utf-8") as f:
    f.write(rtf_content)

with open(os.path.join(PROJECT_DOCS_DIR, "GramaCare_Source_Code.rtf"), "w", encoding="utf-8") as f:
    f.write(rtf_content)
print(f"Generated RTF file: {RTF_PATH}")
