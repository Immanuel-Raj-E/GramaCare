const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
