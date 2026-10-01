# GramaCare - Project Development Rules

## 1. Project Overview

Project Name: GramaCare

Project Type:
Full Stack Web Application for Rural Healthcare Management

Problem:
Rural patients often lack access to centralized medical records. Medical information may be stored in paper form or across different healthcare providers, making it difficult to access complete patient history. Patients also face difficulties with appointment scheduling, prescription management, medical report storage, and communication with doctors.

Solution:
GramaCare is a centralized web-based healthcare management platform that allows patients, doctors, and administrators to securely manage healthcare-related information.

The system must focus on:
- Electronic Health Records
- Appointment Scheduling
- Prescription Management
- Medical Report Management
- Doctor-Patient Communication
- Role-Based Access Control
- User and Doctor Management

This is a Full Stack Development semester project.

The project must demonstrate proper:
- Frontend development
- Backend development
- REST API development
- Database integration
- Authentication
- Authorization
- CRUD operations
- File handling
- Form validation
- Error handling
- Responsive UI
- Secure data handling


# 2. Mandatory Technology Stack

Use MERN stack.

Frontend:
- React.js
- JavaScript
- React Router
- Axios
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

Authentication:
- JWT
- bcrypt/bcryptjs

File Upload:
- Multer

Optional:
- Cloudinary for production file storage
- Socket.IO for real-time messaging
- Recharts for dashboard statistics

Do NOT replace the MERN stack with:
- Django
- Flask
- Laravel
- Spring Boot
- PostgreSQL
- Supabase as the primary database
- Firebase as the primary backend

MongoDB must remain the primary database.


# 3. General Development Principle

Build the application incrementally.

Do not generate the entire project blindly in one step.

Development order:

1. Project setup
2. Database connection
3. Backend structure
4. Authentication
5. Role-based authorization
6. Patient module
7. Doctor module
8. Appointment module
9. Medical records module
10. Prescription module
11. Medical report module
12. Messaging module
13. Notifications
14. Admin dashboard
15. Responsive UI
16. Validation and security
17. Testing
18. Final polishing

Every module must be tested before moving to the next major module.


# 4. User Roles

The system must support exactly three primary roles:

1. Patient
2. Doctor
3. Admin


## 4.1 Patient

Patients can:

- Register
- Login
- Logout
- View dashboard
- Manage profile
- View medical history
- View electronic health records
- Book appointments
- View appointments
- Cancel appointments
- View prescriptions
- Upload medical reports
- View uploaded reports
- Download permitted reports
- Communicate with doctors
- View notifications

Patients must NOT:
- Modify doctor records
- Access another patient's records
- Create prescriptions
- Modify consultation records created by doctors
- Access admin functionality


## 4.2 Doctor

Doctors can:

- Login
- Logout
- Manage professional profile
- View assigned/connected patients
- View patient medical history
- View patient medical reports
- Manage appointment availability
- View appointments
- Accept/reject appointments
- Complete appointments
- Add consultation notes
- Create prescriptions
- View previous prescriptions
- Communicate with patients
- View notifications

Doctors must NOT:
- Access admin controls
- Access unrelated patients' private information
- Modify another doctor's profile
- Delete patient records without proper authorization


## 4.3 Admin

Admin can:

- Login
- View system dashboard
- Manage patients
- Manage doctors
- Approve doctor accounts
- Activate/deactivate users
- View appointments
- View system statistics
- Manage platform-level information

Admin must NOT unnecessarily modify medical records.

Medical records should remain controlled by authorized healthcare users.


# 5. Authentication

Implement secure authentication.

Registration:
- Name
- Email
- Phone
- Password
- Role

For patients:
- Basic patient information

For doctors:
- Professional information

Password requirements:
- Minimum 8 characters
- Hash passwords using bcrypt/bcryptjs
- Never store plain-text passwords

Login:
- Email
- Password

Authentication:
- Use JWT
- Protect private API routes
- Verify JWT on protected requests
- Implement role-based authorization

Never:
- Store passwords in plain text
- Hardcode passwords
- Hardcode JWT secrets
- Commit `.env` files


# 6. Environment Variables

All sensitive configuration must be stored in `.env`.

Example:

MONGO_URI=
JWT_SECRET=
PORT=
CLIENT_URL=

If Cloudinary is used:

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Never place secrets directly inside source code.

Create `.env.example` containing variable names but no real secrets.


# 7. Database Design

Use MongoDB with Mongoose.

Recommended collections/models:

- User
- Patient
- Doctor
- Appointment
- MedicalRecord
- Prescription
- MedicalReport
- Message
- Notification

Use references between related documents.

Do not duplicate large amounts of data unnecessarily.

Example relationships:

User
|
+-- Patient Profile
|
+-- Doctor Profile

Patient
|
+-- Medical Records
+-- Appointments
+-- Prescriptions
+-- Medical Reports
+-- Messages

Doctor
|
+-- Appointments
+-- Consultations
+-- Prescriptions
+-- Messages


# 8. Patient Model

Patient information may include:

- userId
- dateOfBirth
- gender
- bloodGroup
- phone
- address
- emergencyContact
- allergies
- existingConditions

Do not collect unnecessary sensitive information.


# 9. Doctor Model

Doctor information may include:

- userId
- specialization
- qualification
- experience
- licenseNumber
- hospital/clinic
- consultationFee if required
- availability
- approvalStatus

Doctor approval status:

- pending
- approved
- rejected


# 10. Appointment Module

Appointment fields should include:

- patientId
- doctorId
- appointmentDate
- appointmentTime
- reason
- status
- createdAt

Appointment status:

- pending
- confirmed
- rejected
- cancelled
- completed

Workflow:

Patient
    |
    v
Select Doctor
    |
    v
Select Available Date/Time
    |
    v
Book Appointment
    |
    v
Doctor Reviews Request
    |
    +----> Reject
    |
    +----> Confirm
              |
              v
         Consultation
              |
              v
          Completed


# 11. Medical Records Module

Medical records are a core feature of GramaCare.

A medical record can contain:

- patientId
- doctorId
- appointmentId
- date
- symptoms/complaints
- diagnosis
- treatment/consultation notes
- prescribed medicines
- follow-up instructions

Patients can view their records.

Doctors can view records of authorized patients.

Do not allow patients to directly modify doctor-created consultation records.


# 12. Prescription Module

Doctors can create prescriptions.

Prescription fields:

- patientId
- doctorId
- appointmentId
- medicines
- dosage
- frequency
- duration
- instructions
- createdAt

Medicine structure:

- medicineName
- dosage
- frequency
- duration
- instructions

Example:

Medicine:
Paracetamol

Dosage:
500 mg

Frequency:
2 times per day

Duration:
3 days

Instructions:
Take after food.

Patients can view their prescriptions.

Patients cannot create or modify prescriptions.


# 13. Medical Report Module

Patients can upload medical reports.

Examples:
- Blood test
- X-ray report
- Scan report
- Previous prescription
- Laboratory report

Use Multer for file uploads.

Allowed file types should include:
- PDF
- JPG
- JPEG
- PNG

Validate:
- File type
- File size
- Upload permissions

Store file metadata in MongoDB.

Do not store large binary files directly inside MongoDB unless there is a specific reason.

For development, local file storage may be used.

For production, Cloudinary or another secure object-storage solution may be used.

Only authorized users should access medical reports.


# 14. Doctor-Patient Communication

Implement basic doctor-patient messaging.

Message fields:

- senderId
- receiverId
- message
- timestamp
- readStatus

Initially implement normal database-based messaging.

Optional:
Use Socket.IO for real-time messaging after the core system is stable.

Do not make Socket.IO mandatory for the initial MVP.


# 15. Notification Module

Create notifications for important events.

Examples:

- Appointment booked
- Appointment confirmed
- Appointment rejected
- Appointment cancelled
- Appointment completed
- New prescription
- New medical report
- New message

Notification fields:

- userId
- title
- message
- type
- isRead
- createdAt


# 16. Frontend Structure

Use a clean React architecture.

Recommended structure:

frontend/
|
+-- src/
    |
    +-- components/
    +-- pages/
    +-- layouts/
    +-- services/
    +-- hooks/
    +-- context/
    +-- utils/
    +-- assets/
    +-- routes/
    +-- App.jsx
    +-- main.jsx

Pages should be separated by functionality.

Example:

pages/
|
+-- auth/
|   +-- Login.jsx
|   +-- Register.jsx
|
+-- patient/
|   +-- PatientDashboard.jsx
|   +-- Profile.jsx
|   +-- MedicalRecords.jsx
|   +-- Appointments.jsx
|   +-- Prescriptions.jsx
|   +-- MedicalReports.jsx
|   +-- Messages.jsx
|
+-- doctor/
|   +-- DoctorDashboard.jsx
|   +-- Patients.jsx
|   +-- Appointments.jsx
|   +-- Consultation.jsx
|   +-- Prescriptions.jsx
|   +-- Messages.jsx
|
+-- admin/
    +-- AdminDashboard.jsx
    +-- Users.jsx
    +-- Doctors.jsx
    +-- Appointments.jsx


# 17. Backend Structure

Recommended structure:

backend/
|
+-- src/
    |
    +-- config/
    +-- controllers/
    +-- middleware/
    +-- models/
    +-- routes/
    +-- services/
    +-- utils/
    +-- app.js
    +-- server.js

Controllers:
- Handle request/response logic

Models:
- Define MongoDB schemas

Routes:
- Define API endpoints

Middleware:
- Authentication
- Authorization
- Validation
- Error handling
- File upload

Services:
- Business logic where appropriate


# 18. API Design

Use RESTful APIs.

Example:

Authentication:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

Patients:

GET /api/patients/profile
PUT /api/patients/profile

Doctors:

GET /api/doctors
GET /api/doctors/:id
PUT /api/doctors/profile

Appointments:

POST /api/appointments
GET /api/appointments
GET /api/appointments/:id
PUT /api/appointments/:id
DELETE /api/appointments/:id

Medical Records:

GET /api/medical-records
GET /api/medical-records/:id
POST /api/medical-records

Prescriptions:

POST /api/prescriptions
GET /api/prescriptions
GET /api/prescriptions/:id

Reports:

POST /api/reports/upload
GET /api/reports
GET /api/reports/:id

Messages:

POST /api/messages
GET /api/messages/:userId

Notifications:

GET /api/notifications
PUT /api/notifications/:id/read

Use appropriate HTTP status codes.


# 19. API Response Format

Use consistent JSON responses.

Success:

{
  "success": true,
  "message": "Appointment created successfully",
  "data": {}
}

Error:

{
  "success": false,
  "message": "Unable to create appointment"
}

Do not expose:
- Passwords
- JWT secrets
- Internal database errors
- Sensitive server information


# 20. Error Handling

Implement centralized backend error handling.

Handle:

- Invalid request
- Authentication failure
- Authorization failure
- Missing resource
- Duplicate records
- Invalid MongoDB ID
- Database errors
- File upload errors
- Validation errors

Frontend must show user-friendly error messages.

Never display raw stack traces to users.


# 21. Validation

Validation must exist on both frontend and backend.

Validate:

- Email
- Password
- Phone
- Required fields
- Dates
- Appointment times
- File types
- File sizes

Backend validation is mandatory.

Never rely only on frontend validation.


# 22. Security Rules

Healthcare information is sensitive.

Follow these rules:

- Use JWT authentication
- Hash passwords
- Use role-based authorization
- Validate all user input
- Prevent unauthorized record access
- Do not expose passwords
- Do not expose secrets
- Use environment variables
- Restrict file uploads
- Validate uploaded files
- Sanitize user input where necessary
- Use CORS correctly
- Do not trust client-provided user IDs for authorization
- Always determine the authenticated user from the verified JWT

A patient must only be able to access their own records.

A doctor must only access records they are authorized to access.

An admin must have clearly defined administrative permissions.


# 23. Frontend UI Design

The application should look like a professional healthcare platform.

Design goals:

- Clean
- Simple
- Accessible
- Responsive
- Professional
- Easy to navigate
- Suitable for rural users

Use:
- Clear navigation
- Large readable buttons
- Simple forms
- Cards
- Tables where appropriate
- Status badges
- Search
- Filters
- Empty states
- Loading states
- Error states

Avoid:
- Excessive animations
- Unnecessary gradients
- Extremely complicated layouts
- Excessive decorative elements


# 24. Responsive Design

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Use responsive Tailwind CSS classes.

Do not create a separate mobile codebase.

The same React application should adapt to different screen sizes.


# 25. Rural Healthcare UX

The system is intended for rural healthcare use.

Therefore:

- Keep interfaces simple.
- Minimize unnecessary network requests.
- Avoid unnecessarily large images.
- Use clear labels instead of confusing icons.
- Use readable fonts.
- Make important actions easy to find.
- Provide clear error messages.
- Keep forms simple.
- Design for potentially slow internet connections.

Future support may include:
- Offline caching
- PWA
- Multilingual support
- Local language interfaces

These should not be implemented before the core system is complete.


# 26. Dashboard Requirements

Patient dashboard should display:

- Welcome message
- Upcoming appointment
- Recent medical records
- Recent prescriptions
- Recent notifications
- Quick actions

Doctor dashboard should display:

- Today's appointments
- Pending appointment requests
- Patient count
- Recent consultations
- Quick actions

Admin dashboard should display:

- Total patients
- Total doctors
- Total appointments
- Pending doctor approvals
- Recent system activity

Dashboard statistics must be retrieved from backend APIs.


# 27. Search and Filtering

Implement search where useful.

Doctor search:
- Name
- Specialization

Patient search for doctors:
- Patient name
- Patient ID where appropriate

Appointments:
- Date
- Status
- Doctor/patient

Do not implement complex search infrastructure unless required.


# 28. Loading States

Every API-dependent page must have a loading state.

Examples:

- Loading spinner
- Skeleton
- Loading message

Never show a blank page while an API request is running.


# 29. Empty States

When there is no data, show a meaningful message.

Examples:

"No upcoming appointments."

"No prescriptions available."

"No medical reports uploaded."

"No notifications."

Do not leave empty tables blank.


# 30. Code Quality

Write clean and maintainable code.

Rules:

- Use meaningful variable names.
- Avoid unnecessary duplication.
- Keep components reasonably small.
- Separate API logic from UI components.
- Reuse common components.
- Keep controllers focused.
- Keep database logic inside models/services where appropriate.
- Add comments only where they improve understanding.
- Do not generate unnecessary comments for obvious code.


# 31. Naming Conventions

React components:

PascalCase

Example:
PatientDashboard.jsx
AppointmentCard.jsx

Functions and variables:

camelCase

Example:
getAppointments()
createPrescription()

Database models:

PascalCase

Example:
User.js
Appointment.js
MedicalRecord.js

API routes:

Use lowercase plural nouns.

Example:

/api/appointments
/api/prescriptions
/api/medical-records


# 32. Git Rules

Use Git from the beginning.

Recommended branches:

main
development

Feature branches:

feature/authentication
feature/appointments
feature/medical-records
feature/prescriptions

Commit messages should be meaningful.

Examples:

feat: add JWT authentication
feat: add appointment booking
feat: add medical record module
fix: resolve appointment validation
ui: improve patient dashboard

Never commit:

.env
node_modules
uploaded private medical files
build artifacts


# 33. Documentation

Maintain:

README.md

README must contain:

- Project overview
- Problem statement
- Features
- Technology stack
- System architecture
- Folder structure
- Installation instructions
- Environment variables
- Running instructions
- API overview
- Screenshots
- Future enhancements

Also maintain:

.env.example


# 34. Testing

Test backend APIs using Postman or equivalent.

Test:

- Registration
- Login
- Invalid login
- Role authorization
- Appointment creation
- Appointment update
- Medical record access
- Prescription creation
- Report upload
- Unauthorized access

Frontend testing should verify:

- Forms
- Navigation
- Protected routes
- Dashboard
- CRUD operations
- Error states
- Responsive layout


# 35. Protected Routes

Frontend must implement protected routes.

Example:

/patient/*
/doctor/*
/admin/*

A patient must not be able to navigate to:

/admin
/doctor

by manually entering the URL.

However, frontend protection alone is NOT sufficient.

Backend APIs must also verify authorization.


# 36. Important Business Rules

1. A patient cannot book an appointment with an unapproved doctor.

2. A doctor cannot access arbitrary patient records.

3. Only doctors can create prescriptions.

4. Patients can only view their own prescriptions.

5. Patients can only view their own medical records.

6. Doctors can only access records of patients they are authorized to treat.

7. Patients cannot modify doctor-created consultation records.

8. Appointment times must not conflict.

9. Cancelled appointments cannot be completed.

10. Only authorized users can access medical reports.

11. Admin functionality must be inaccessible to normal users.

12. Doctor accounts should require approval before they can provide services.


# 37. Core MVP

The first working version MUST contain:

### Authentication
- Register
- Login
- Logout
- JWT
- Role-based access

### Patient
- Profile
- Medical records
- Appointments
- Prescriptions
- Medical reports

### Doctor
- Profile
- Patient records
- Appointment management
- Consultation
- Prescription creation

### Admin
- User management
- Doctor approval
- Dashboard

### Communication
- Basic doctor-patient messaging

Do not start advanced features until this MVP works.


# 38. Features That Are Optional

Only implement these after the MVP is stable:

- Socket.IO real-time chat
- Cloudinary
- PWA
- Offline caching
- Multilingual support
- Map integration
- Email notifications
- SMS notifications
- Advanced analytics
- PDF prescription generation


# 39. Features NOT Required

Do not add these unless explicitly requested:

- AI disease diagnosis
- AI medical diagnosis
- Disease prediction
- Medical recommendation engine
- Blockchain
- Cryptocurrency
- Payment gateway
- Complex hospital ERP
- Insurance management
- Complex ML models

The project is primarily a MERN full-stack development project.


# 40. AI Usage Rule

Do not introduce AI features just to make the project appear advanced.

The core project must work without AI.

If AI is added in the future, it must be treated as an optional enhancement and must not replace normal healthcare workflows.


# 41. Offline Capability

The primary application is a web application.

The first version does not need complete offline functionality.

However, architecture should avoid making future offline support impossible.

Future enhancement:

React PWA
+
Service Worker
+
IndexedDB
+
Synchronization API

Do not implement this until the main application is stable.


# 42. Development Workflow for Antigravity

When implementing a feature:

1. Inspect the existing project.
2. Understand the current folder structure.
3. Do not overwrite working functionality unnecessarily.
4. Identify affected frontend files.
5. Identify affected backend files.
6. Identify required database models.
7. Implement backend API.
8. Test the API.
9. Implement frontend integration.
10. Test frontend.
11. Fix errors.
12. Update documentation if required.

Before making large changes, explain what files will be changed.

Do not recreate the entire project when only a small feature needs modification.


# 43. Dependency Rules

Do not install unnecessary packages.

Before adding a dependency:
- Check whether the functionality can be implemented using existing dependencies.
- Use established and maintained packages.
- Avoid duplicate libraries providing the same functionality.

Keep package.json clean.


# 44. API and Database Rules

Never make database calls directly from React components.

Correct:

React Component
      ↓
API Service
      ↓
Express Route
      ↓
Controller
      ↓
Mongoose
      ↓
MongoDB

Do not:

React
  ↓
MongoDB


# 45. Authentication Flow

Use:

React
 ↓
Login API
 ↓
Express
 ↓
Validate credentials
 ↓
bcrypt password verification
 ↓
Generate JWT
 ↓
Return authentication result
 ↓
Frontend stores authentication state
 ↓
Protected API requests
 ↓
JWT verification middleware


# 46. Final Project Architecture

The final architecture should follow:

                    GRAMACARE
                        |
             +----------+----------+
             |                     |
          FRONTEND              BACKEND
          React.js             Node.js
             |                  Express.js
             |                     |
             |              REST API
             |                     |
             +----------+----------+
                        |
                     MongoDB
                        |
                    Mongoose


# 47. Final Acceptance Criteria

The project is considered complete only when:

- Patient registration works.
- Doctor registration works.
- Admin login works.
- JWT authentication works.
- Role-based authorization works.
- Patient dashboard works.
- Doctor dashboard works.
- Admin dashboard works.
- Patients can manage their profiles.
- Patients can book appointments.
- Doctors can manage appointments.
- Doctors can create consultation records.
- Doctors can create prescriptions.
- Patients can view prescriptions.
- Patients can upload medical reports.
- Authorized users can access medical reports.
- Doctor-patient messaging works.
- Notifications work.
- APIs are protected.
- Database relationships work correctly.
- Validation works.
- Error handling works.
- Application is responsive.
- No secrets are committed.
- README is complete.
- Project can be run from a fresh environment using documented instructions.


# 48. Priority Order

When there is a conflict between features, follow this priority:

1. Security
2. Data correctness
3. Core functionality
4. Backend API reliability
5. User experience
6. Responsive design
7. Performance
8. Advanced features
9. Visual enhancements

Never sacrifice security or data correctness for visual features.


# 49. Important Instruction to Antigravity

This project is a semester-level Full Stack Development project.

Do not over-engineer the application.

Do not introduce unnecessary technologies.

Do not change the technology stack without explicit approval.

Do not add AI/ML unless explicitly requested.

Do not create fake functionality that only looks functional.

Every button and UI action should connect to a real implementation or clearly be marked as unavailable.

All major CRUD operations must use the backend API and MongoDB.

Build the project in small, testable modules.

Prioritize a complete working MVP before advanced features.