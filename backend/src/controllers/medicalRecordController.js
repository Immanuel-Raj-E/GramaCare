const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get medical records (EHR)
// @route   GET /api/medical-records
// @access  Protected
const getMedicalRecords = async (req, res) => {
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

    const records = await MedicalRecord.find(filter)
      .sort({ recordDate: -1 })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('appointmentId');

    return successResponse(res, 200, 'Medical records retrieved', records);
  } catch (error) {
    console.error('getMedicalRecords error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get single medical record details
// @route   GET /api/medical-records/:id
// @access  Protected
const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('appointmentId');

    if (!record) {
      return errorResponse(res, 404, 'Medical record not found');
    }

    // Access control
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || !record.patientId._id.equals(patient._id)) {
        return errorResponse(res, 403, 'Unauthorized to view this medical record');
      }
    }

    return successResponse(res, 200, 'Medical record details retrieved', record);
  } catch (error) {
    console.error('getMedicalRecordById error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Create new medical record / EHR entry
// @route   POST /api/medical-records
// @access  Protected (Doctor)
const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      symptoms,
      diagnosis,
      consultationNotes,
      treatmentPlan,
      followUpDate,
      followUpInstructions
    } = req.body;

    if (!patientId || !diagnosis || !consultationNotes) {
      return errorResponse(res, 400, 'Patient, diagnosis, and consultation notes are required');
    }

    let doctorId = req.body.doctorId;
    if (!doctorId) {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        doctorId = doctor._id;
      } else {
        // Fallback for demo mode
        const firstDoc = await Doctor.findOne();
        if (firstDoc) doctorId = firstDoc._id;
      }
    }

    if (!doctorId) {
      return errorResponse(res, 400, 'Doctor profile required to create clinical record');
    }

    const symptomsArray = Array.isArray(symptoms)
      ? symptoms
      : (typeof symptoms === 'string' ? symptoms.split(',').map(s => s.trim()).filter(Boolean) : ['Clinical review']);

    const record = await MedicalRecord.create({
      patientId,
      doctorId,
      appointmentId: appointmentId || undefined,
      symptoms: symptomsArray.length > 0 ? symptomsArray : ['General checkup'],
      diagnosis,
      consultationNotes,
      treatmentPlan: treatmentPlan || '',
      followUpDate: followUpDate || undefined,
      followUpInstructions: followUpInstructions || ''
    });

    const populated = await MedicalRecord.findById(record._id)
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } });

    return successResponse(res, 201, 'Medical record created successfully', populated);
  } catch (error) {
    console.error('createMedicalRecord error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord
};
