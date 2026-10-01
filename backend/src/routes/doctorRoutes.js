const express = require('express');
const {
  getDoctors,
  getDoctorById,
  getDoctorProfileMe,
  updateDoctorProfile,
  getDoctorDashboard,
  getMyPatients
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile/me', protect, getDoctorProfileMe);
router.put('/profile', protect, updateDoctorProfile);
router.get('/dashboard', protect, getDoctorDashboard);
router.get('/my/patients', protect, getMyPatients);

router.get('/', getDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
