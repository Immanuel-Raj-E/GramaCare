const express = require('express');
const { getPrescriptions, getPrescriptionById } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescriptionById);

module.exports = router;
