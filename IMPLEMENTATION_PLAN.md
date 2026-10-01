# GramaCare – Implementation Plan
**Rural Healthcare Management and Digital Health Record Platform**
---
## 1. Overall System Architecture
GramaCare is built as a modular, three-tier MERN (MongoDB, Express.js, React.js, Node.js) web application designed specifically for rural healthcare management.
+-----------------------------------------------------------------------+
|                              CLIENT TIER                              |
|   React.js 18+ (SPA) + React Router v6 + Tailwind CSS + Axios         |
|   Role-Based Dashboards: Patient | Doctor | Admin                     |
+-----------------------------------+-----------------------------------+
                                    |
                                    | HTTPS / REST API (JSON + Multer multipart)
                                    v
+-----------------------------------+-----------------------------------+
|                            APPLICATION TIER                           |
|   Node.js + Express.js REST API Server                                |
|   - Security Middleware: Helmet, CORS, Rate Limiting                  |
|   - Auth Middleware: JWT verification & Role extraction               |
|   - Access Control: Patient ownership & Doctor-Patient authorization  |
|   - Controllers: Modular Request/Response handlers                    |
|   - Services: Business logic & cross-module validation                |
|   - File Upload: Multer (disk storage in uploads/ with type/size validation)
|   - Error Handling: Centralized error handling & standard JSON output |
+-----------------------------------+-----------------------------------+
                                    |
                                    | Mongoose ODM (Schemas & Validations)
                                    v
+-----------------------------------+-----------------------------------+
|                              DATA TIER                                |
|   MongoDB Database (Collections: Users, Patients, Doctors,            |
|   Appointments, MedicalRecords, Prescriptions, MedicalReports,        |
|   Messages, Notifications)                                            |
+-----------------------------------------------------------------------+
---
## 2. Frontend Architecture
The frontend follows a feature-oriented, modular React architecture with dedicated layout wrappers and protected routes based on authenticated user roles.
### Directory Structure
frontend/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── assets/
    ├── components/
    │   ├── common/         # Navbar, Sidebar, Footer, Modal, Button, Card, Badge, Alert, Loader, EmptyState
    │   ├── appointment/    # BookingModal, StatusBadge, AppointmentCard
    │   ├── record/         # RecordCard, RecordDetailsModal
    │   ├── prescription/   # PrescriptionCard, PrescriptionPrintView
    │   └── report/         # FileUploadZone, ReportPreviewModal
    ├── layouts/
    │   ├── PublicLayout.jsx
    │   ├── PatientLayout.jsx
    │   ├── DoctorLayout.jsx
    │   └── AdminLayout.jsx
    ├── pages/
    │   ├── public/         # LandingPage, Login, Register, Unauthorized, NotFound
    │   ├── patient/        # PatientDashboard, Profile, Appointments, MedicalRecords, Prescriptions, MedicalReports, Messages, Notifications
    │   ├── doctor/         # DoctorDashboard, Profile, PatientList, Appointments, Consultation, Prescriptions, Messages, Notifications
    │   └── admin/          # AdminDashboard, UserManagement, DoctorApproval, AppointmentManagement
    ├── routes/
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   └── NotificationContext.jsx
    ├── hooks/
    │   ├── useAuth.js
    │   └── useFetch.js
    ├── services/
    │   ├── api.js          # Axios instance with JWT interceptor & unified error handling
    │   ├── authService.js
    │   ├── patientService.js
    │   ├── doctorService.js
    │   ├── appointmentService.js
    │   ├── recordService.js
    │   ├── prescriptionService.js
    │   ├── reportService.js
    │   ├── messageService.js
    │   ├── notificationService.js
    │   └── adminService.js
    └── utils/
        ├── formatters.js   # Date, time, phone formatting
        └── validators.js   # Form input validation rules
---
## 3. Backend Architecture
The backend follows an MVC-Service layered pattern ensuring separation of concerns, testability, and enterprise-grade clean code.
### Directory Structure
backend/
├── package.json
├── .env.example
├── uploads/                # Protected directory for local medical report storage
└── src/
    ├── server.js           # Server bootstrap & DB connection initialization
    ├── app.js              # Express app, middleware registration, route mounts
    ├── config/
    │   └── db.js           # Mongoose connection with retry & event handling
    ├── middleware/
    │   ├── authMiddleware.js      # JWT authentication verification
    │   ├── roleMiddleware.js      # Role-based authorization (patient, doctor, admin)
    │   ├── uploadMiddleware.js    # Multer configuration, MIME filter, file size limit (5MB)
    │   ├── errorMiddleware.js     # Centralized error handler & 404 handler
    │   └── validationMiddleware.js# Input sanitization and field validation
    ├── models/
    │   ├── User.js
    │   ├── Patient.js
    │   ├── Doctor.js
    │   ├── Appointment.js
    │   ├── MedicalRecord.js
    │   ├── Prescription.js
    │   ├── MedicalReport.js
    │   ├── Message.js
    │   └── Notification.js
    ├── controllers/
    │   ├── authController.js
    │   ├── patientController.js
    │   ├── doctorController.js
    │   ├── appointmentController.js
    │   ├── medicalRecordController.js
    │   ├── prescriptionController.js
    │   ├── medicalReportController.js
    │   ├── messageController.js
    │   ├── notificationController.js
    │   └── adminController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── patientRoutes.js
    │   ├── doctorRoutes.js
    │   ├── appointmentRoutes.js
    │   ├── medicalRecordRoutes.js
    │   ├── prescriptionRoutes.js
    │   ├── medicalReportRoutes.js
    │   ├── messageRoutes.js
    │   ├── notificationRoutes.js
    │   └── adminRoutes.js
    ├── services/
    │   ├── notificationService.js # Helper for automated in-app notifications
    │   └── authorizationService.js# Helper to check if Doctor is authorized to treat Patient
    └── utils/
        ├── apiResponse.js         # Unified response helper (success & error format)
        └── generateToken.js       # JWT generation helper
---
## 4. MongoDB Schema Design
### 4.1 User Schema (User.js)
*Represents application accounts and credentials.*
- 
ame: String, required, trim
- email: String, required, unique, lowercase, trim
- phone: String, required, trim
- password: String, required, minlength: 8 (hashed with bcryptjs, salt rounds: 10)
- ole: String, enum: ['patient', 'doctor', 'admin'], required
- isActive: Boolean, default: true
- 	imestamps: true
### 4.2 Patient Schema (Patient.js)
*Extended profile for patients.*
- userId: ObjectId -> User (unique, ref: 'User')
- dateOfBirth: Date
- gender: String, enum: ['male', 'female', 'other']
- loodGroup: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
- ddress: { village: String, district: String, state: String, pincode: String }
- emergencyContact: { name: String, phone: String, relation: String }
- llergies: [String]
- existingConditions: [String]
- 	imestamps: true
### 4.3 Doctor Schema (Doctor.js)
*Extended profile for medical practitioners.*
- userId: ObjectId -> User (unique, ref: 'User')
- specialization: String, required
- qualification: String, required (e.g. MBBS, MD, BAMS)
- experienceYears: Number, required, min: 0
- licenseNumber: String, required, unique
- hospitalOrClinic: String, required
- consultationFee: Number, default: 0
- vailability: [
    {
      dayOfWeek: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      startTime: String, // '09:00'
      endTime: String    // '13:00'
    }
  ]
- pprovalStatus: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'
- pprovalRemarks: String
- 	imestamps: true
### 4.4 Appointment Schema (Appointment.js)
*Tracks clinic/consultation scheduling.*
- patientId: ObjectId -> Patient, required, ref: 'Patient'
- doctorId: ObjectId -> Doctor, required, ref: 'Doctor'
- ppointmentDate: Date, required
- ppointmentTime: String, required (e.g. '10:00 AM')
- eason: String, required
- status: String, enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'], default: 'pending'
- 
otes: String
- 	imestamps: true
*Indexes: compound index on (doctorId, appointmentDate, appointmentTime) to assist conflict prevention.*
### 4.5 MedicalRecord Schema (MedicalRecord.js)
*Core Electronic Health Record (EHR) created by doctors.*
- patientId: ObjectId -> Patient, required, ref: 'Patient'
- doctorId: ObjectId -> Doctor, required, ref: 'Doctor'
- ppointmentId: ObjectId -> Appointment, ref: 'Appointment'
- ecordDate: Date, default: Date.now
- symptoms: [String], required
- diagnosis: String, required
- consultationNotes: String, required
- 	reatmentPlan: String
- ollowUpDate: Date
- ollowUpInstructions: String
- 	imestamps: true
### 4.6 Prescription Schema (Prescription.js)
*Formal prescription created by doctors.*
- patientId: ObjectId -> Patient, required, ref: 'Patient'
- doctorId: ObjectId -> Doctor, required, ref: 'Doctor'
- ppointmentId: ObjectId -> Appointment, ref: 'Appointment'
- medicines: [
    {
      medicineName: { type: String, required: true },
      dosage: { type: String, required: true },       // e.g. '500 mg'
      frequency: { type: String, required: true },    // e.g. '2 times/day'
      duration: { type: String, required: true },     // e.g. '5 days'
      instructions: { type: String }                  // e.g. 'Take after meals'
    }
  ]
- generalInstructions: String
- createdAt: Date, default: Date.now
### 4.7 MedicalReport Schema (MedicalReport.js)
*Uploaded diagnostic and clinical reports (Lab, X-Ray, Blood, Scans).*
- patientId: ObjectId -> Patient, required, ref: 'Patient'
- uploadedBy: ObjectId -> User, required, ref: 'User'
- eportTitle: String, required
- eportType: String, enum: ['Lab Report', 'X-Ray', 'Blood Test', 'Scan', 'Prescription', 'Other'], required
- eportDate: Date, default: Date.now
- ileUrl: String, required
- ileName: String, required
- ileType: String, required (PDF, JPG, JPEG, PNG)
- ileSize: Number, required
- 
otes: String
- 	imestamps: true
### 4.8 Message Schema (Message.js)
*Doctor-Patient communication record.*
- senderId: ObjectId -> User, required, ref: 'User'
- eceiverId: ObjectId -> User, required, ref: 'User'
- message: String, required
- eadStatus: Boolean, default: false
- createdAt: Date, default: Date.now
### 4.9 Notification Schema (Notification.js)
*In-app alerts for system activities.*
- userId: ObjectId -> User, required, ref: 'User'
- 	itle: String, required
- message: String, required
- 	ype: String, enum: ['appointment', 'prescription', 'report', 'message', 'system'], default: 'system'
- isRead: Boolean, default: false
- createdAt: Date, default: Date.now
---
## 5. API Design & Endpoint Specification
All responses follow the unified response format:
- Success: { "success": true, "message": "...", "data": { ... } }
- Error: { "success": false, "message": "..." }
### 5.1 Authentication (/api/auth)
- POST /api/auth/register (Public) - Register patient or doctor
- POST /api/auth/login (Public) - Login with email & password, returns JWT & user profile
- POST /api/auth/logout (Protected) - Invalidate client session
- GET  /api/auth/me (Protected) - Get current authenticated user details
### 5.2 Patients (/api/patients)
- GET /api/patients/profile (Patient) - Get logged-in patient's profile
- PUT /api/patients/profile (Patient) - Update patient's personal/medical info
- GET /api/patients/dashboard (Patient) - Aggregated dashboard metrics & recent items
- GET /api/patients/:id (Doctor/Admin) - View patient info (if authorized)
### 5.3 Doctors (/api/doctors)
- GET /api/doctors (Public / Patient) - Search & list approved doctors (filters: specialization, name)
- GET /api/doctors/:id (Public / Patient) - Get public profile of specific doctor
- GET /api/doctors/profile/me (Doctor) - Get logged-in doctor's full profile
- PUT /api/doctors/profile (Doctor) - Update doctor profile & availability
- GET /api/doctors/dashboard (Doctor) - Aggregated stats (today's appointments, pending count)
- GET /api/doctors/my/patients (Doctor) - List distinct patients who have consulted/booked with doctor
### 5.4 Appointments (/api/appointments)
- POST /api/appointments (Patient) - Book an appointment with an approved doctor
- GET  /api/appointments (Protected) - List appointments (filtered by patient or doctor role)
- GET  /api/appointments/:id (Protected) - Get appointment details
- PUT  /api/appointments/:id/status (Doctor / Patient) - Update status (confirm, reject, complete by doctor; cancel by patient)
- DELETE /api/appointments/:id (Patient/Admin) - Cancel / delete pending appointment
### 5.5 Medical Records (/api/medical-records)
- POST /api/medical-records (Doctor) - Create EHR consultation record for patient
- GET  /api/medical-records (Protected) - Get medical records (patient sees own; doctor sees authorized patients)
- GET  /api/medical-records/:id (Protected) - View individual EHR record details
- GET  /api/medical-records/patient/:patientId (Doctor/Admin) - Doctor views records for authorized patient
### 5.6 Prescriptions (/api/prescriptions)
- POST /api/prescriptions (Doctor) - Create formal prescription
- GET  /api/prescriptions (Protected) - List prescriptions (patient sees own; doctor sees created)
- GET  /api/prescriptions/:id (Protected) - Get single prescription details
### 5.7 Medical Reports (/api/reports)
- POST /api/reports/upload (Patient) - Multer upload (PDF/JPG/PNG max 5MB)
- GET  /api/reports (Protected) - List reports (patient sees own; doctor sees authorized patient reports)
- GET  /api/reports/:id (Protected) - Get single report metadata
- GET  /api/reports/:id/download (Protected) - Secure file download stream (checks authorization)
- DELETE /api/reports/:id (Patient) - Delete own report
### 5.8 Messages (/api/messages)
- POST /api/messages (Protected) - Send message between doctor and patient
- GET  /api/messages/conversations (Protected) - List active user conversation threads
- GET  /api/messages/:otherUserId (Protected) - Get message history between auth user and recipient
- PUT  /api/messages/:otherUserId/read (Protected) - Mark messages as read
### 5.9 Notifications (/api/notifications)
- GET /api/notifications (Protected) - Get user's notifications
- PUT /api/notifications/:id/read (Protected) - Mark individual notification as read
- PUT /api/notifications/read-all (Protected) - Mark all user notifications as read
### 5.10 Admin (/api/admin)
- GET /api/admin/stats (Admin) - Dashboard counts (total patients, doctors, appointments, pending approvals)
- GET /api/admin/users (Admin) - Manage all users with role filtering & activation toggles
- PUT /api/admin/users/:id/status (Admin) - Activate or deactivate user
- GET /api/admin/doctors (Admin) - List all doctors with approval statuses
- PUT /api/admin/doctors/:id/approval (Admin) - Approve or reject doctor application
- GET /api/admin/appointments (Admin) - Global appointment oversight
---
## 6. Authentication & Authorization Flow
### Authentication Flow
1. **User Registration**:
   - Patient or Doctor fills registration form.
   - Backend validates required fields, email format, and password length (>=8 chars).
   - Password is encrypted via cryptjs.hash(password, 10).
   - User record created in users collection.
   - Corresponding Patient or Doctor profile document created automatically in a transaction or sequential step.
   - JWT generated containing { id: user._id, role: user.role }.
   - Returned with sanitized user info (no password).
2. **User Login**:
   - User provides email and password.
   - User verified against users collection (and checked if isActive === true).
   - If Doctor: checks if account exists.
   - Password checked via cryptjs.compare.
   - JWT issued with expiry (e.g., 7 days).
   - User profile returned to frontend and stored securely in localStorage.
### Authorization Flow & Critical Security Constraints
1. **Role Verification**:
   - uthMiddleware: Extracts Authorization: Bearer <token>, verifies JWT secret, attaches eq.user (_id, ole).
   - oleMiddleware(['doctor']): Rejects with 403 Forbidden if eq.user.role does not match allowed roles.
2. **Ownership & Patient Privacy**:
   - Never trust client-provided patientId for patient requests.
   - For patient endpoints, eq.patient is resolved by querying Patient.findOne({ userId: req.user._id }).
   - A patient can NEVER read or modify another patient's data.
3. **Doctor-Patient Access Control**:
   - A doctor can only access a patient's medical records or reports if there is an established clinical relationship (i.e. confirmed appointment or consultation history between that doctor and patient).
   - Prevents arbitrary doctor probing of rural patient records.
4. **Doctor Verification Requirement**:
   - Only doctors with pprovalStatus === 'approved' can accept appointments, issue prescriptions, or write consultation notes.
   - Patients cannot select or book unapproved doctors.
5. **Medical Record Immutability**:
   - Patients have read-only access to consultation notes and prescriptions.
   - Only the treating doctor can append or generate prescriptions and records.
---
## 7. Module Dependencies & Execution Order
[Module 1: Config, DB & Server]
             │
             ▼
[Module 2: User Model & Auth (JWT, bcrypt)]
             │
             ▼
[Module 3: Patient & Doctor Models / Profiles]
             │
             ▼
[Module 4: Admin Management & Doctor Approval]
             │
             ▼
[Module 5: Appointment System (Booking, Conflicts, Status)]
             │
             ▼
[Module 6: Medical Records (EHR) & Prescriptions]
             │
             ▼
[Module 7: Medical Reports (Multer upload & secure access)]
             │
             ▼
[Module 8: Messaging & In-app Notifications]
             │
             ▼
[Module 9: Frontend Foundation & Design System (Tailwind, Common Components)]
             │
             ▼
[Module 10: Frontend Auth & Role Protected Routing]
             │
             ▼
[Module 11: Patient Experience Pages]
             │
             ▼
[Module 12: Doctor Experience Pages]
             │
             ▼
[Module 13: Admin Dashboard & Approval Pages]
             │
             ▼
[Module 14: End-to-End Testing & Polishing]
---
## 8. Development Phases
### Phase 1: Environment & Project Scaffolding
- Set up directories (ackend/, rontend/, uploads/).
- Initialize .gitignore, root .env.example, ackend/.env.
- Initialize ackend/package.json with dependencies: express, mongoose, dotenv, cors, jsonwebtoken, cryptjs, multer.
- Initialize rontend/ using Vite + React + Tailwind CSS.
### Phase 2: Database Connection & Core Models
- Implement ackend/src/config/db.js with error handling.
- Build 9 Mongoose models: User, Patient, Doctor, Appointment, MedicalRecord, Prescription, MedicalReport, Message, Notification.
### Phase 3: Authentication & Security Middleware
- Implement generateToken.js and piResponse.js.
- Build uthController.js and uthRoutes.js.
- Build uthMiddleware.js and oleMiddleware.js.
- Test registration and login with both patient and doctor roles.
### Phase 4: Core Domain APIs (Backend First)
- **Doctor & Patient Profiles**: Implement patientController.js and doctorController.js.
- **Appointments**: Conflict checking, booking, status changes (pending -> confirmed -> completed / cancelled).
- **Medical Records & Prescriptions**: EHR consultation note creation, prescription medicines array validation.
- **Medical Reports**: Multer config with file filters (PDF, JPEG, PNG, max 5MB), metadata storage, secure file streaming.
- **Messaging**: Store and retrieve messages by recipient.
- **Notifications**: Automated notification creation triggers on status changes.
- **Admin**: Doctor approval/rejection and dashboard counts.
### Phase 5: Backend API Verification
- Run test script / API requests across all endpoints.
- Confirm role protection: Patients blocked from admin/doctor routes, unapproved doctors blocked from clinical actions.
### Phase 6: Frontend Design System & Public Pages
- Configure Tailwind CSS with healthcare-oriented palette (Slate, Emerald/Teal, Soft Blue, Amber, Rose).
- Create UI primitives: Navbar, Sidebar, Button, Card, Badge, Modal, Alert, LoadingSpinner, EmptyState.
- Build LandingPage.jsx, Login.jsx, Register.jsx (with role toggle between Patient and Doctor).
### Phase 7: Patient Portal
- PatientDashboard.jsx: Welcome card, next appointment, recent EHRs, recent prescriptions, notifications, quick actions.
- Profile.jsx: Personal, medical, and emergency contact details.
- Appointments.jsx: Doctor listing, availability slot picker, booking modal, active/past appointments with cancel action.
- MedicalRecords.jsx: Chronological EHR cards with details modal.
- Prescriptions.jsx: Clean prescription cards with medicine dosage schedule & print button.
- MedicalReports.jsx: File upload dropzone, report list, view/download file.
- Messages.jsx: Conversation view with selected doctor.
- Notifications.jsx: List of alerts with mark as read.
### Phase 8: Doctor Portal
- DoctorDashboard.jsx: Today's appointment schedule, pending requests, total patients, quick consultation link.
- Profile.jsx: Qualifications, specialization, clinic, availability schedule editor.
- Appointments.jsx: Pending approval queue (Accept/Reject), today's list, past history.
- Consultation.jsx: Patient EHR viewer, add diagnosis, consultation notes, follow-up instructions.
- Prescriptions.jsx: Multi-item medicine builder (name, dosage, frequency, duration, instructions).
- PatientList.jsx: Patients with clinical history under this doctor.
- Messages.jsx: Communication with connected patients.
### Phase 9: Admin Portal
- AdminDashboard.jsx: Metric cards (total patients, doctors, appointments, pending approvals) with quick links.
- DoctorApproval.jsx: List pending doctors with license info, approve/reject buttons with remarks.
- UserManagement.jsx: View all registered users, activate/deactivate accounts.
- AppointmentManagement.jsx: System-wide appointment log.
### Phase 10: Responsiveness & Rural UX Optimization
- Test all pages across Mobile (375px), Tablet (768px), and Desktop (1280px).
- Verify high contrast readability, simple labels, large tap targets, and comprehensive empty/loading states.
### Phase 11: End-to-End Verification & Documentation
- Execute full system demonstration flow.
- Complete README.md with installation commands, architecture diagrams, and API docs.
---
## 9. Testing Strategy
1. **Unit / Integration API Testing**:
   - Backend validation tests using automated node scripts / curl requests:
     - Register patient & doctor.
     - Doctor login & profile completion.
     - Admin approval of doctor.
     - Patient appointment booking with doctor.
     - Doctor appointment confirmation.
     - Doctor consultation note (MedicalRecord) & Prescription creation.
     - Patient medical report upload (valid PDF vs rejected EXE).
     - Cross-user authorization check (Patient A accessing Patient B's report -> 403 Forbidden).
2. **Frontend User Flow Testing**:
   - Public navigation & responsive drawer.
   - Patient registration & automatic login redirect.
   - Doctor registration & "Pending Approval" notice badge.
   - Admin login & instant approval toggle.
   - Booking modal with date/time pickers.
   - Consultation note submission & real-time reflection in patient view.
   - Prescription print layout.
3. **Security Testing**:
   - Unauthenticated token rejection (401).
   - Role escalation attempts (Patient calling /api/admin/doctors -> 403).
   - Path traversal and malicious file upload prevention.
   - Password integrity in DB (bcrypt hash verification).
---
## 10. Potential Technical Issues & Mitigation
| Potential Technical Issue | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Appointment Double-Booking** | Conflicting patient slots for the same doctor | Add unique compound index on (doctorId, appointmentDate, appointmentTime) where status is confirmed/pending; validate in ppointmentController before creation. |
| **Cross-Tenant Patient Record Leakage** | Severe healthcare privacy breach | Never accept patient IDs from frontend body for patient operations; always read eq.user._id from validated JWT; verify doctor authorization via appointment history before sharing records. |
| **Malicious File Uploads** | Server compromise / disk exhaustion | Strict MIME type validation in Multer (allow only pplication/pdf, image/jpeg, image/png); enforce 5MB limit; store files with generated UUID filenames; keep outside web root or serve through streaming controller. |
| **Unapproved Doctor Prescribing** | Legal / medical compliance violation | Middleware check pprovalStatus === 'approved' before allowing any appointment confirmation, consultation creation, or prescription generation. |
| **Flaky Rural Connectivity** | Form submission drops, UI hangs | Clear loading indicators on all action buttons; optimistic feedback where safe; descriptive error messages; lightweight network payloads without heavy bloat. |
---
## 11. Final Acceptance Checklist
- [x] Backend starts cleanly on PORT 5000 with MongoDB connected
- [x] Frontend starts cleanly on PORT 5173 with Vite
- [x] Patient registration and login functional
- [x] Doctor registration with pending approval state functional
- [x] Admin login functional (seeded admin account)
- [ ] Admin can approve or reject doctor accounts
- [ ] Approved doctor can update profile and availability
- [x] Patient can search approved doctors and book appointment
- [x] Double booking on same date and time slot is prevented
- [ ] Doctor can accept, reject, and mark appointments completed
- [ ] Doctor can create consultation EHR notes for completed appointments
- [ ] Doctor can create multi-medicine prescriptions
- [x] Patient can view their medical records and prescriptions
- [x] Patient can upload medical reports (PDF/JPG/PNG)
- [x] Doctor and Patient can securely view and download authorized reports
- [x] Doctor-Patient messaging functional
- [x] System notifications generated on appointments, prescriptions, and reports
- [x] Role-based route protection works on both frontend and backend
- [x] Responsive design verified on Mobile, Tablet, and Desktop (Auth & Patient pages)
- [x] Centralized error handling returns clean JSON responses
- [x] Passwords hashed with bcrypt and never exposed in API responses
- [ ] README.md contains complete setup instructions