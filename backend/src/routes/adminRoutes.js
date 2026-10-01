const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getDoctorApplications,
  updateDoctorApproval,
  getAllAppointments
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/doctors', getDoctorApplications);
router.put('/doctors/:id/approval', updateDoctorApproval);
router.get('/appointments', getAllAppointments);

module.exports = router;
