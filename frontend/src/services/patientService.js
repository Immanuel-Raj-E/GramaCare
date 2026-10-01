import api from './api';

// Profile & Dashboard
export const getProfile = async () => {
  const res = await api.get('/patients/profile');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/patients/profile', profileData);
  return res.data;
};

export const getDashboard = async () => {
  const res = await api.get('/patients/dashboard');
  return res.data;
};

// Doctors
export const getApprovedDoctors = async (params = {}) => {
  const res = await api.get('/doctors', { params });
  return res.data;
};

// Appointments
export const getAppointments = async (params = {}) => {
  const res = await api.get('/appointments', { params });
  return res.data;
};

export const bookAppointment = async (appointmentData) => {
  const res = await api.post('/appointments', appointmentData);
  return res.data;
};

export const cancelAppointment = async (appointmentId) => {
  const res = await api.put(`/appointments/${appointmentId}/cancel`);
  return res.data;
};

// Medical Records
export const getMedicalRecords = async () => {
  const res = await api.get('/medical-records');
  return res.data;
};

export const getMedicalRecordById = async (id) => {
  const res = await api.get(`/medical-records/${id}`);
  return res.data;
};

// Prescriptions
export const getPrescriptions = async () => {
  const res = await api.get('/prescriptions');
  return res.data;
};

export const getPrescriptionById = async (id) => {
  const res = await api.get(`/prescriptions/${id}`);
  return res.data;
};

// Reports
export const getReports = async () => {
  const res = await api.get('/reports');
  return res.data;
};

export const uploadReport = async (formData) => {
  const res = await api.post('/reports/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteReport = async (id) => {
  const res = await api.delete(`/reports/${id}`);
  return res.data;
};

// Messaging
export const getConversations = async () => {
  const res = await api.get('/messages/conversations');
  return res.data;
};

export const getMessagesWithUser = async (otherUserId) => {
  const res = await api.get(`/messages/${otherUserId}`);
  return res.data;
};

export const sendMessage = async (receiverId, message) => {
  const res = await api.post('/messages', { receiverId, message });
  return res.data;
};

// Notifications
export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put('/notifications/read-all');
  return res.data;
};
