const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
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
    recordDate: {
      type: Date,
      default: Date.now
    },
    symptoms: {
      type: [String],
      required: [true, 'Please provide reported symptoms']
    },
    diagnosis: {
      type: String,
      required: [true, 'Please provide doctor diagnosis'],
      trim: true
    },
    consultationNotes: {
      type: String,
      required: [true, 'Consultation notes cannot be empty'],
      trim: true
    },
    treatmentPlan: {
      type: String,
      default: ''
    },
    followUpDate: {
      type: Date
    },
    followUpInstructions: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

medicalRecordSchema.index({ patientId: 1, recordDate: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
