const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all approved doctors with optional filtering
// @route   GET /api/doctors
// @access  Public / Patient
const getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const query = { approvalStatus: 'approved' };

    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    let doctors = await Doctor.find(query).populate('userId', 'name email phone isActive');

    // Optional text filter on doctor's name or clinic
    if (search) {
      const term = search.toLowerCase();
      doctors = doctors.filter(
        (doc) =>
          doc.userId?.name?.toLowerCase().includes(term) ||
          doc.hospitalOrClinic?.toLowerCase().includes(term) ||
          doc.specialization?.toLowerCase().includes(term)
      );
    }

    return successResponse(res, 200, 'Approved doctors retrieved', doctors);
  } catch (error) {
    console.error('getDoctors error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get single doctor profile
// @route   GET /api/doctors/:id
// @access  Public / Patient
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone isActive');
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor not found');
    }
    return successResponse(res, 200, 'Doctor details retrieved', doctor);
  } catch (error) {
    console.error('getDoctorById error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getDoctors,
  getDoctorById
};
