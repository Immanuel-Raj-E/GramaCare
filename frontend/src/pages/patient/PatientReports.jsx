import React, { useState, useEffect } from 'react';
import * as patientService from '../../services/patientService';
import {
  UploadCloud,
  FileText,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  File,
  HardDrive
} from 'lucide-react';

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [modalError, setModalError] = useState('');

  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: 'Lab Report',
    notes: '',
    reportFile: null
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await patientService.getReports();
      if (res.success) {
        setReports(res.data);
      } else {
        setErrorMsg('Failed to load reports');
      }
    } catch (err) {
      setErrorMsg('Error loading reports from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setModalError('File size exceeds the 5 MB limit. Please select a smaller file.');
      return;
    }

    // Validate type
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setModalError('Invalid format. Please upload a PDF, JPG, or PNG document.');
      return;
    }

    setModalError('');
    setFormData((prev) => ({ ...prev, reportFile: file }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formData.reportTitle || !formData.reportFile) {
      setModalError('Please specify report title and select a valid file.');
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append('reportTitle', formData.reportTitle);
      form.append('reportType', formData.reportType);
      form.append('notes', formData.notes);
      form.append('reportFile', formData.reportFile);

      const res = await patientService.uploadReport(form);
      if (res.success) {
        setSuccessMsg('Medical report uploaded successfully.');
        setUploadModalOpen(false);
        setFormData({
          reportTitle: '',
          reportType: 'Lab Report',
          notes: '',
          reportFile: null
        });
        fetchReports();
      } else {
        setModalError(res.message || 'Upload failed.');
      }
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || 'Failed to upload report.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical report?')) return;

    try {
      const res = await patientService.deleteReport(id);
      if (res.success) {
        setSuccessMsg('Report deleted successfully.');
        fetchReports();
      } else {
        setErrorMsg('Failed to delete report.');
      }
    } catch (err) {
      setErrorMsg('Error deleting report.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Medical & Diagnostic Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store and share diagnostic blood tests, X-Rays, lab results, and previous medical documents.
          </p>
        </div>

        <button
          onClick={() => {
            setUploadModalOpen(true);
            setModalError('');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-200 transition"
        >
          <Plus className="w-4 h-4" />
          Upload New Report
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reports Table / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Loading uploaded reports...</p>
        </div>
      ) : reports.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50/80 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Report Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {reports.map((rep) => (
                  <tr key={rep._id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                          <File className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{rep.reportTitle}</p>
                          <p className="text-slate-400 text-[11px] truncate max-w-xs">{rep.fileName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {rep.reportType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(rep.reportDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {formatFileSize(rep.fileSize)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`http://localhost:5000/api/reports/${rep._id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition"
                          title="Download report document"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>

                        <button
                          onClick={() => handleDelete(rep._id)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No Medical Reports Uploaded</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Upload blood reports, lab scans, or hospital discharge summaries to keep them in one safe place.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" />
            Upload First Report
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                Upload Diagnostic Report
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Blood Count (CBC) or Chest X-Ray"
                  value={formData.reportTitle}
                  onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Category *
                </label>
                <select
                  required
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="Scan">Scan (CT / Ultrasound)</option>
                  <option value="Prescription">Previous Prescription</option>
                  <option value="Other">Other Diagnostic Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select File (PDF, JPG, PNG - Max 5 MB) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Notes / Context (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Add any specific observations or referring laboratory details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading File...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReports;
