const express = require('express');
const { getMedicalRecords, getMedicalRecordById, createMedicalRecord } = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMedicalRecords);
router.post('/', protect, createMedicalRecord);
router.get('/:id', protect, getMedicalRecordById);

module.exports = router;
