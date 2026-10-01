import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PatientLayout from '../layouts/PatientLayout';

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

// Other Role Dashboards (Doctor & Admin)
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Patient Protected Portal (Nested in PatientLayout) */}
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

      {/* Doctor Protected Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
