const path = require('path');
const fs = require('fs');
const MedicalReport = require('../models/MedicalReport');
const Patient = require('../models/Patient');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Upload a new medical report (PDF / JPG / PNG)
// @route   POST /api/reports/upload
// @access  Protected (Patient)
const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Please select a report file to upload');
    }

    const { reportTitle, reportType, notes } = req.body;
    if (!reportTitle) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return errorResponse(res, 400, 'Please provide a descriptive report title');
    }

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      fs.unlinkSync(req.file.path);
      return errorResponse(res, 404, 'Patient profile not found');
    }

    const report = await MedicalReport.create({
      patientId: patient._id,
      uploadedBy: req.user._id,
      reportTitle,
      reportType: reportType || 'Lab Report',
      fileUrl: `/uploads/reports/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      notes: notes || ''
    });

    return successResponse(res, 201, 'Medical report uploaded successfully', report);
  } catch (error) {
    console.error('uploadReport error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get accessible reports
// @route   GET /api/reports
// @access  Protected
const getReports = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return errorResponse(res, 404, 'Patient profile not found');
      filter.patientId = patient._id;
    }

    const reports = await MedicalReport.find(filter)
      .sort({ reportDate: -1, createdAt: -1 })
      .populate('uploadedBy', 'name email role');

    return successResponse(res, 200, 'Medical reports retrieved', reports);
  } catch (error) {
    console.error('getReports error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Download or stream a medical report securely
// @route   GET /api/reports/:id/download
// @access  Protected
const downloadReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return errorResponse(res, 404, 'Medical report not found');
    }

    // Access control
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || !report.patientId.equals(patient._id)) {
        return errorResponse(res, 403, 'Unauthorized to access this medical report');
      }
    }

    // Path on disk
    const filename = path.basename(report.fileUrl);
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'reports', filename);

    if (!fs.existsSync(filePath)) {
      return errorResponse(res, 404, 'File not found on server');
    }

    return res.download(filePath, report.fileName);
  } catch (error) {
    console.error('downloadReport error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Delete own medical report
// @route   DELETE /api/reports/:id
// @access  Protected (Patient)
const deleteReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return errorResponse(res, 404, 'Report not found');
    }

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || !report.patientId.equals(patient._id)) {
      return errorResponse(res, 403, 'Unauthorized to delete this report');
    }

    // Delete physical file
    const filename = path.basename(report.fileUrl);
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'reports', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await MedicalReport.findByIdAndDelete(report._id);
    return successResponse(res, 200, 'Medical report deleted successfully');
  } catch (error) {
    console.error('deleteReport error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  uploadReport,
  getReports,
  downloadReport,
  deleteReport
};
