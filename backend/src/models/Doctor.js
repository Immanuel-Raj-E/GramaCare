const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String, // format: "09:00" (24-hour)
      required: true
    },
    endTime: {
      type: String, // format: "13:00" (24-hour)
      required: true
    }
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization (e.g. General Medicine, Pediatrics, Orthopedics)'],
      trim: true
    },
    qualification: {
      type: String,
      required: [true, 'Please provide medical qualification (e.g. MBBS, MD, MS)'],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please provide years of clinical experience'],
      min: [0, 'Experience cannot be negative'],
      default: 0
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please provide medical council registration / license number'],
      unique: true,
      trim: true
    },
    hospitalOrClinic: {
      type: String,
      required: [true, 'Please provide affiliated Primary Health Centre, Hospital, or Clinic name'],
      trim: true
    },
    consultationFee: {
      type: Number,
      default: 0
    },
    availability: {
      type: [availabilitySlotSchema],
      default: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '13:00' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '13:00' },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '13:00' }
      ]
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvalRemarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
