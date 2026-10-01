const express = require('express');
const { getProfile, updateProfile, getDashboard } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/profile', protect, authorize('patient'), getProfile);
router.put('/profile', protect, authorize('patient'), updateProfile);
router.get('/dashboard', protect, authorize('patient'), getDashboard);

module.exports = router;
