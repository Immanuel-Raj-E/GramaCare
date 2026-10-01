import api from './api';

// Platform Statistics
export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

// User Management
export const getAllUsers = async (params = {}) => {
  const res = await api.get('/admin/users', { params });
  return res.data;
};

export const toggleUserStatus = async (userId, isActive) => {
  const res = await api.put(`/admin/users/${userId}/status`, { isActive });
  return res.data;
};

// Doctor Verification & Approvals
export const getDoctorApplications = async (params = {}) => {
  const res = await api.get('/admin/doctors', { params });
  return res.data;
};

export const updateDoctorApproval = async (doctorId, approvalStatus, remarks = '') => {
  const res = await api.put(`/admin/doctors/${doctorId}/approval`, { approvalStatus, remarks });
  return res.data;
};

// Global Appointments Oversight
export const getAllAppointments = async (params = {}) => {
  const res = await api.get('/admin/appointments', { params });
  return res.data;
};
