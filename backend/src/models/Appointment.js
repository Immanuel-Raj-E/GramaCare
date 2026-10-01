const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required']
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required']
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    appointmentTime: {
      type: String, // e.g., '10:00 AM' or '10:00'
      required: [true, 'Appointment time is required']
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason for consultation / symptoms'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Helpful index to search and prevent conflicts
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
