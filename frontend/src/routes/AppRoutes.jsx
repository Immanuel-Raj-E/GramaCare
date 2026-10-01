import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Unauthorized from '../pages/public/Unauthorized';

// Patient Module Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientProfile from '../pages/patient/PatientProfile';
import PatientAppointments from '../pages/patient/PatientAppointments';
import PatientRecords from '../pages/patient/PatientRecords';
import PatientPrescriptions from '../pages/patient/PatientPrescriptions';
import PatientReports from '../pages/patient/PatientReports';
import PatientMessages from '../pages/patient/PatientMessages';
import PatientNotifications from '../pages/patient/PatientNotifications';

// Doctor Module Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import DoctorPatients from '../pages/doctor/DoctorPatients';
import DoctorConsultation from '../pages/doctor/DoctorConsultation';
import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions';
import DoctorMessages from '../pages/doctor/DoctorMessages';
import DoctorProfile from '../pages/doctor/DoctorProfile';
import DoctorNotifications from '../pages/doctor/DoctorNotifications';

// Admin Module Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAppointments from '../pages/admin/AdminAppointments';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Patient Portal (Nested in PatientLayout) */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="records" element={<PatientRecords />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="messages" element={<PatientMessages />} />
        <Route path="notifications" element={<PatientNotifications />} />
      </Route>

      {/* Doctor Portal (Nested in DoctorLayout) */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="consultation" element={<DoctorConsultation />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="messages" element={<DoctorMessages />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="notifications" element={<DoctorNotifications />} />
      </Route>

      {/* Admin Portal (Nested in AdminLayout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
