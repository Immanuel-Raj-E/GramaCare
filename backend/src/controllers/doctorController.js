const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
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

// @desc    Get logged-in doctor profile
// @route   GET /api/doctors/profile/me
// @access  Protected (Doctor)
const getDoctorProfileMe = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name email phone role isActive');
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor profile not found');
    }
    return successResponse(res, 200, 'Doctor profile retrieved', doctor);
  } catch (error) {
    console.error('getDoctorProfileMe error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Update doctor profile and availability
// @route   PUT /api/doctors/profile
// @access  Protected (Doctor)
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      specialization,
      qualification,
      experienceYears,
      hospitalOrClinic,
      consultationFee,
      availability
    } = req.body;

    if (name || phone) {
      const userUpdates = {};
      if (name) userUpdates.name = name;
      if (phone) userUpdates.phone = phone;
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor profile not found');
    }

    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experienceYears !== undefined) doctor.experienceYears = Number(experienceYears);
    if (hospitalOrClinic) doctor.hospitalOrClinic = hospitalOrClinic;
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee);
    if (availability && Array.isArray(availability)) doctor.availability = availability;

    await doctor.save();
    const updated = await Doctor.findById(doctor._id).populate('userId', 'name email phone role isActive');

    return successResponse(res, 200, 'Doctor profile updated successfully', updated);
  } catch (error) {
    console.error('updateDoctorProfile error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get aggregated dashboard stats for doctor
// @route   GET /api/doctors/dashboard
// @access  Protected (Doctor)
const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor profile not found');
    }

    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

    // Today's appointments
    const todaysAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfToday, $lte: endOfToday }
    })
      .sort({ appointmentTime: 1 })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name phone email' }
      });

    // Pending appointment requests
    const pendingRequests = await Appointment.find({
      doctorId: doctor._id,
      status: 'pending'
    })
      .sort({ appointmentDate: 1 })
      .limit(5)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name phone email' }
      });

    // Recent consultations conducted
    const recentConsultations = await MedicalRecord.find({ doctorId: doctor._id })
      .sort({ recordDate: -1 })
      .limit(4)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name phone' }
      });

    // Distinct patients
    const patientIds = await Appointment.distinct('patientId', { doctorId: doctor._id });
    const totalPatientCount = patientIds.length;

    const totalAppointments = await Appointment.countDocuments({ doctorId: doctor._id });
    const completedAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'completed'
    });

    return successResponse(res, 200, 'Doctor dashboard retrieved', {
      doctor,
      todaysAppointments,
      pendingRequests,
      recentConsultations,
      stats: {
        todaysCount: todaysAppointments.length,
        pendingCount: pendingRequests.length,
        totalPatientCount,
        totalAppointments,
        completedAppointments
      }
    });
  } catch (error) {
    console.error('getDoctorDashboard error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get list of connected patients for this doctor
// @route   GET /api/doctors/my/patients
// @access  Protected (Doctor)
const getMyPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor profile not found');
    }

    // Get distinct patient IDs from appointments
    const patientIds = await Appointment.distinct('patientId', { doctorId: doctor._id });

    // Find patient documents
    const patients = await Patient.find({ _id: { $in: patientIds } })
      .populate('userId', 'name email phone')
      .sort({ updatedAt: -1 });

    return successResponse(res, 200, 'Connected patients retrieved', patients);
  } catch (error) {
    console.error('getMyPatients error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorProfileMe,
  updateDoctorProfile,
  getDoctorDashboard,
  getMyPatients
};
