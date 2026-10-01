import api from './api';

// Doctor Profile & Dashboard
export const getDoctorProfile = async () => {
  const res = await api.get('/doctors/profile/me');
  return res.data;
};

export const updateDoctorProfile = async (profileData) => {
  const res = await api.put('/doctors/profile', profileData);
  return res.data;
};

export const getDoctorDashboard = async () => {
  const res = await api.get('/doctors/dashboard');
  return res.data;
};

export const getDoctorPatients = async () => {
  const res = await api.get('/doctors/my/patients');
  return res.data;
};

// Appointments Management
export const getDoctorAppointments = async (params = {}) => {
  const res = await api.get('/appointments', { params });
  return res.data;
};

export const updateAppointmentStatus = async (appointmentId, status, notes = '') => {
  const res = await api.put(`/appointments/${appointmentId}/status`, { status, notes });
  return res.data;
};

export const cancelAppointment = async (appointmentId) => {
  const res = await api.put(`/appointments/${appointmentId}/cancel`);
  return res.data;
};

// Clinical Consultation & Records
export const getMedicalRecords = async () => {
  const res = await api.get('/medical-records');
  return res.data;
};

export const createMedicalRecord = async (recordData) => {
  const res = await api.post('/medical-records', recordData);
  return res.data;
};

// Prescriptions
export const getPrescriptions = async () => {
  const res = await api.get('/prescriptions');
  return res.data;
};

export const createPrescription = async (prescriptionData) => {
  const res = await api.post('/prescriptions', prescriptionData);
  return res.data;
};

// Consultations Messaging
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
