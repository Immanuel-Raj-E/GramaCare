const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get prescriptions
// @route   GET /api/prescriptions
// @access  Protected
const getPrescriptions = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return errorResponse(res, 404, 'Patient profile not found');
      filter.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) return errorResponse(res, 404, 'Doctor profile not found');
      filter.doctorId = doctor._id;
    }

    const prescriptions = await Prescription.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('appointmentId');

    return successResponse(res, 200, 'Prescriptions retrieved', prescriptions);
  } catch (error) {
    console.error('getPrescriptions error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Protected
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('appointmentId');

    if (!prescription) {
      return errorResponse(res, 404, 'Prescription not found');
    }

    // Access control
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || !prescription.patientId._id.equals(patient._id)) {
        return errorResponse(res, 403, 'Unauthorized to view this prescription');
      }
    }

    return successResponse(res, 200, 'Prescription retrieved', prescription);
  } catch (error) {
    console.error('getPrescriptionById error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById
};
