const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { createNotification } = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Book a new appointment with an approved doctor
// @route   POST /api/appointments
// @access  Protected (Patient)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return errorResponse(res, 400, 'Please provide doctor, date, time, and reason for consultation');
    }

    // 1. Resolve patient profile from auth identity (never trust client patientId)
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return errorResponse(res, 404, 'Patient profile not found');
    }

    // 2. Validate Doctor existence and approval status
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor not found');
    }

    if (doctor.approvalStatus !== 'approved') {
      return errorResponse(
        res,
        400,
        'Appointments can only be booked with approved healthcare doctors'
      );
    }

    // 3. Conflict Prevention (Rule 8: Appointment times must not conflict)
    // Normalize date to start of day for accurate comparison
    const parsedDate = new Date(appointmentDate);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const existingConflict = await Appointment.findOne({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      appointmentTime: appointmentTime.trim(),
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingConflict) {
      return errorResponse(
        res,
        400,
        `Doctor is already booked at ${appointmentTime} on this date. Please select another slot.`
      );
    }

    // 4. Create Appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate: parsedDate,
      appointmentTime: appointmentTime.trim(),
      reason,
      notes: notes || '',
      status: 'pending'
    });

    // 5. Trigger notification for doctor
    await createNotification({
      userId: doctor.userId._id,
      title: 'New Appointment Request',
      message: `${req.user.name} has requested an appointment on ${parsedDate.toDateString()} at ${appointmentTime}.`,
      type: 'appointment'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    return successResponse(res, 201, 'Appointment booked successfully and sent for doctor confirmation', populatedAppointment);
  } catch (error) {
    console.error('createAppointment error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Protected
const getAppointments = async (req, res) => {
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

    const { status } = req.query;
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: -1, createdAt: -1 })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    return successResponse(res, 200, 'Appointments retrieved', appointments);
  } catch (error) {
    console.error('getAppointments error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Protected
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    // Authorization check
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || !appointment.patientId._id.equals(patient._id)) {
        return errorResponse(res, 403, 'Unauthorized to view this appointment');
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || !appointment.doctorId._id.equals(doctor._id)) {
        return errorResponse(res, 403, 'Unauthorized to view this appointment');
      }
    }

    return successResponse(res, 200, 'Appointment details retrieved', appointment);
  } catch (error) {
    console.error('getAppointmentById error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Protected
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: '_id name' }
      })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: '_id name' }
      });

    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    if (['completed', 'cancelled', 'rejected'].includes(appointment.status)) {
      return errorResponse(
        res,
        400,
        `Cannot cancel an appointment that is already ${appointment.status}`
      );
    }

    // Check authorization: must be either the patient or the doctor
    let isPatient = false;
    let isDoctor = false;

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || !appointment.patientId._id.equals(patient._id)) {
        return errorResponse(res, 403, 'Unauthorized to cancel this appointment');
      }
      isPatient = true;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || !appointment.doctorId._id.equals(doctor._id)) {
        return errorResponse(res, 403, 'Unauthorized to cancel this appointment');
      }
      isDoctor = true;
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Notify the other party
    const notifyUserId = isPatient ? appointment.doctorId.userId._id : appointment.patientId.userId._id;
    await createNotification({
      userId: notifyUserId,
      title: 'Appointment Cancelled',
      message: `The appointment scheduled for ${new Date(appointment.appointmentDate).toDateString()} at ${appointment.appointmentTime} was cancelled by ${req.user.name}.`,
      type: 'appointment'
    });

    return successResponse(res, 200, 'Appointment cancelled successfully', appointment);
  } catch (error) {
    console.error('cancelAppointment error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Update appointment status (confirmed, rejected, completed)
// @route   PUT /api/appointments/:id/status
// @access  Protected
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status || !['confirmed', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return errorResponse(res, 400, 'Invalid appointment status');
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'patientId', populate: { path: 'userId', select: '_id name' } });

    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    if (appointment.status === 'cancelled' && status === 'completed') {
      return errorResponse(res, 400, 'Cancelled appointments cannot be completed (Rule 9)');
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    // Notify patient
    if (appointment.patientId?.userId?._id) {
      await createNotification({
        userId: appointment.patientId.userId._id,
        title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your appointment with ${appointment.doctorId?.userId?.name || 'Healthcare Doctor'} has been marked as ${status}.`,
        type: 'appointment'
      });
    }

    return successResponse(res, 200, `Appointment marked as ${status}`, appointment);
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus
};
