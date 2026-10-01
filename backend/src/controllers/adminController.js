const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get system-wide platform statistics for admin dashboard
// @route   GET /api/admin/stats
// @access  Protected (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ approvalStatus: 'pending' });
    const approvedDoctors = await Doctor.countDocuments({ approvalStatus: 'approved' });

    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    const totalRecords = await MedicalRecord.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();
    const totalUsers = await User.countDocuments();

    // Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, 200, 'Admin platform stats retrieved', {
      counts: {
        totalUsers,
        totalPatients,
        totalDoctors,
        pendingDoctors,
        approvedDoctors,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRecords,
        totalPrescriptions
      },
      recentUsers,
      recentAppointments
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get all users with role filter and search
// @route   GET /api/admin/users
// @access  Protected (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Toggle user active/inactive status
// @route   PUT /api/admin/users/:id/status
// @access  Protected (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Toggle or set isActive
    if (typeof req.body.isActive === 'boolean') {
      user.isActive = req.body.isActive;
    } else {
      user.isActive = !user.isActive;
    }

    await user.save();

    return successResponse(res, 200, `User account ${user.isActive ? 'activated' : 'deactivated'}`, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get doctor applications with approval status filter
// @route   GET /api/admin/doctors
// @access  Protected (Admin)
const getDoctorApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.approvalStatus = status;
    }

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone isActive createdAt')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Doctor applications retrieved', doctors);
  } catch (error) {
    console.error('getDoctorApplications error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Approve or reject doctor license / registration
// @route   PUT /api/admin/doctors/:id/approval
// @access  Protected (Admin)
const updateDoctorApproval = async (req, res) => {
  try {
    const { approvalStatus, remarks } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return errorResponse(res, 400, 'Invalid approval status');
    }

    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email _id');
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor not found');
    }

    doctor.approvalStatus = approvalStatus;
    await doctor.save();

    // Send notification to doctor
    if (doctor.userId?._id) {
      await Notification.create({
        userId: doctor.userId._id,
        title: `Doctor Application ${approvalStatus.toUpperCase()}`,
        message: `Your GramaCare doctor registration has been ${approvalStatus} by platform administrators.${remarks ? ` Note: ${remarks}` : ''}`,
        type: 'general'
      }).catch(err => console.error('Notification error in doctor approval:', err));
    }

    return successResponse(res, 200, `Doctor registration marked as ${approvalStatus}`, doctor);
  } catch (error) {
    console.error('updateDoctorApproval error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get all appointments for oversight
// @route   GET /api/admin/appointments
// @access  Protected (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name specialization' } })
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    return successResponse(res, 200, 'All appointments retrieved', appointments);
  } catch (error) {
    console.error('getAllAppointments error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getDoctorApplications,
  updateDoctorApproval,
  getAllAppointments
};
