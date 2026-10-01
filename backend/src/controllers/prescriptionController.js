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

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Protected (Doctor)
const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, generalInstructions } = req.body;

    if (!patientId) {
      return errorResponse(res, 400, 'Patient reference is required');
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return errorResponse(res, 400, 'At least one medicine is required');
    }

    // Validate medicines structure
    for (const med of medicines) {
      if (!med.medicineName || !med.dosage || !med.frequency || !med.duration) {
        return errorResponse(
          res,
          400,
          'Each medicine must specify medicineName, dosage, frequency, and duration'
        );
      }
    }

    let doctorId = req.body.doctorId;
    if (!doctorId) {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        doctorId = doctor._id;
      } else {
        const firstDoc = await Doctor.findOne();
        if (firstDoc) doctorId = firstDoc._id;
      }
    }

    if (!doctorId) {
      return errorResponse(res, 400, 'Doctor profile required to issue prescription');
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      appointmentId: appointmentId || undefined,
      medicines,
      generalInstructions: generalInstructions || ''
    });

    const populated = await Prescription.findById(prescription._id)
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } });

    // Notify patient
    const Notification = require('../models/Notification');
    if (populated.patientId?.userId?._id) {
      await Notification.create({
        userId: populated.patientId.userId._id,
        title: 'New Prescription Issued',
        message: `Dr. ${populated.doctorId?.userId?.name || 'Healthcare Doctor'} has issued a new prescription for you with ${medicines.length} medicine(s).`,
        type: 'prescription'
      }).catch(err => console.error('Notification error in prescription:', err));
    }

    return successResponse(res, 201, 'Prescription issued successfully', populated);
  } catch (error) {
    console.error('createPrescription error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  createPrescription
};
