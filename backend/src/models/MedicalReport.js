const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required']
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user reference is required']
    },
    reportTitle: {
      type: String,
      required: [true, 'Please provide report title'],
      trim: true
    },
    reportType: {
      type: String,
      enum: ['Lab Report', 'X-Ray', 'Blood Test', 'Scan', 'Prescription', 'Other'],
      default: 'Lab Report',
      required: true
    },
    reportDate: {
      type: Date,
      default: Date.now
    },
    fileUrl: {
      type: String,
      required: [true, 'File storage path/URL is required']
    },
    fileName: {
      type: String,
      required: [true, 'Original file name is required']
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
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

medicalReportSchema.index({ patientId: 1, reportDate: -1 });

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
