const express = require('express');
const {
  uploadReport,
  getReports,
  downloadReport,
  deleteReport
} = require('../controllers/medicalReportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', protect, authorize('patient'), upload.single('reportFile'), uploadReport);
router.get('/', protect, getReports);
router.get('/:id/download', protect, downloadReport);
router.delete('/:id', protect, authorize('patient'), deleteReport);

module.exports = router;
