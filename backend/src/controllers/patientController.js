const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get current logged in patient profile
// @route   GET /api/patients/profile
// @access  Protected (Patient)
const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).populate('userId', 'name email phone role isActive');
    if (!patient) {
      return errorResponse(res, 404, 'Patient profile not found');
    }
    return successResponse(res, 200, 'Patient profile retrieved', patient);
  } catch (error) {
    console.error('getProfile error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Update current logged in patient profile
// @route   PUT /api/patients/profile
// @access  Protected (Patient)
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      village,
      district,
      state,
      pincode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      allergies,
      existingConditions
    } = req.body;

    // 1. Update basic user details
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (phone) userUpdates.phone = phone;
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates, { new: true });
    }

    // 2. Update patient profile
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return errorResponse(res, 404, 'Patient profile not found');
    }

    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (gender) patient.gender = gender;
    if (bloodGroup) patient.bloodGroup = bloodGroup;

    patient.address = {
      village: village !== undefined ? village : patient.address.village,
      district: district !== undefined ? district : patient.address.district,
      state: state !== undefined ? state : patient.address.state,
      pincode: pincode !== undefined ? pincode : patient.address.pincode
    };

    patient.emergencyContact = {
      name: emergencyContactName !== undefined ? emergencyContactName : patient.emergencyContact.name,
      phone: emergencyContactPhone !== undefined ? emergencyContactPhone : patient.emergencyContact.phone,
      relation: emergencyContactRelation !== undefined ? emergencyContactRelation : patient.emergencyContact.relation
    };

    if (allergies !== undefined) {
      patient.allergies = Array.isArray(allergies) ? allergies : allergies.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (existingConditions !== undefined) {
      patient.existingConditions = Array.isArray(existingConditions)
        ? existingConditions
        : existingConditions.split(',').map((s) => s.trim()).filter(Boolean);
    }

    await patient.save();
    const updatedPatient = await Patient.findById(patient._id).populate('userId', 'name email phone role isActive');

    return successResponse(res, 200, 'Profile updated successfully', updatedPatient);
  } catch (error) {
    console.error('updateProfile error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get aggregated patient dashboard metrics & recent items
// @route   GET /api/patients/dashboard
// @access  Protected (Patient)
const getDashboard = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return errorResponse(res, 404, 'Patient profile not found');
    }

    // 1. Upcoming appointment
    const upcomingAppointment = await Appointment.findOne({
      patientId: patient._id,
      status: { $in: ['pending', 'confirmed'] },
      appointmentDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })
      .sort({ appointmentDate: 1 })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    // 2. Recent Medical Records
    const recentRecords = await MedicalRecord.find({ patientId: patient._id })
      .sort({ recordDate: -1 })
      .limit(3)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      });

    // 3. Recent Prescriptions
    const recentPrescriptions = await Prescription.find({ patientId: patient._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      });

    // 4. Notifications
    const unreadNotificationsCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    const recentNotifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Total counts for statistics
    const totalAppointments = await Appointment.countDocuments({ patientId: patient._id });
    const totalPrescriptions = await Prescription.countDocuments({ patientId: patient._id });
    const totalRecords = await MedicalRecord.countDocuments({ patientId: patient._id });
    const totalReports = await MedicalReport.countDocuments({ patientId: patient._id });

    return successResponse(res, 200, 'Patient dashboard data retrieved', {
      patient,
      upcomingAppointment,
      recentRecords,
      recentPrescriptions,
      recentNotifications,
      unreadNotificationsCount,
      stats: {
        totalAppointments,
        totalPrescriptions,
        totalRecords,
        totalReports
      }
    });
  } catch (error) {
    console.error('getDashboard error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboard
};
