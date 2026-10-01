const mongoose = require('mongoose');

const medicineItemSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true
    },
    dosage: {
      type: String, // e.g. '500 mg', '10 ml', '1 tablet'
      required: [true, 'Dosage is required'],
      trim: true
    },
    frequency: {
      type: String, // e.g. 'Once daily', 'Twice daily (1-0-1)', 'Thrice daily'
      required: [true, 'Frequency is required'],
      trim: true
    },
    duration: {
      type: String, // e.g. '3 days', '1 week', '1 month'
      required: [true, 'Duration is required'],
      trim: true
    },
    instructions: {
      type: String, // e.g. 'Take after food', 'Take on empty stomach'
      default: ''
    }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    medicines: {
      type: [medicineItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A prescription must contain at least one prescribed medicine'
      }
    },
    generalInstructions: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

prescriptionSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
