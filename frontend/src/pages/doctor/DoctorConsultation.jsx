import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDoctorPatients,
  createMedicalRecord,
  getMedicalRecords
} from '../../services/doctorService';
import {
  ClipboardList,
  User,
  Activity,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  PlusCircle,
  History
} from 'lucide-react';

const DoctorConsultation = () => {
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    patientId: initialPatientId,
    symptoms: '',
    diagnosis: '',
    consultationNotes: '',
    treatmentPlan: '',
    followUpDate: '',
    followUpInstructions: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patRes, recRes] = await Promise.all([
        getDoctorPatients(),
        getMedicalRecords()
      ]);
      if (patRes.success) {
        setPatients(patRes.data);
        if (!formData.patientId && patRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, patientId: patRes.data[0]._id }));
        }
      }
      if (recRes.success) {
        setRecords(recRes.data);
      }
    } catch (err) {
      console.error('Failed to load consultation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      setMessage({ text: 'Please select a patient', type: 'error' });
      return;
    }
    if (!formData.diagnosis.trim() || !formData.consultationNotes.trim()) {
      setMessage({ text: 'Diagnosis and Consultation Notes are required', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await createMedicalRecord(formData);
      if (res.success) {
        setMessage({ text: 'Clinical record created and saved to EHR successfully!', type: 'success' });
        setFormData({
          patientId: formData.patientId,
          symptoms: '',
          diagnosis: '',
          consultationNotes: '',
          treatmentPlan: '',
          followUpDate: '',
          followUpInstructions: ''
        });
        fetchData();
        setActiveTab('history');
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to create medical record',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Consultation & EHR</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Record comprehensive clinical observations, diagnoses, and treatment plans directly into patient EHRs.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'new'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> New Clinical Note
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'history'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" /> Past Consultations ({records.length})
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ text: '', type: '' })} className="font-bold">
            ×
          </button>
        </div>
      )}

      {activeTab === 'new' ? (
        /* Form */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Patient *
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="w-full sm:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {patients.length === 0 ? (
                  <option value="">No connected patients found</option>
                ) : (
                  patients.map((pat) => (
                    <option key={pat._id} value={pat._id}>
                      {pat.userId?.name || 'Patient'} ({pat.userId?.phone || 'No phone'}) - {pat.address?.village || 'Village'}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symptoms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Reported Symptoms * (comma-separated)
                </label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="e.g. High fever, dry cough, body aches for 3 days"
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="e.g. Acute Viral Bronchitis / Suspected Dengue"
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Consultation Examination Notes & Observations *
              </label>
              <textarea
                name="consultationNotes"
                value={formData.consultationNotes}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Physical examination notes: Chest clear to auscultation, throat mildly congested, BP 120/80 mmHg, pulse 76 bpm..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Treatment Plan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Treatment Plan & Advice
              </label>
              <textarea
                name="treatmentPlan"
                value={formData.treatmentPlan}
                onChange={handleChange}
                rows={3}
                placeholder="Rest for 3 days, drink plenty of warm fluids, steam inhalation twice daily, avoid cold drinks..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Follow-up Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Follow-up Review Date (optional)
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Follow-up Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Follow-up Instructions
                </label>
                <input
                  type="text"
                  name="followUpInstructions"
                  value={formData.followUpInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Return if high fever persists after 48 hours"
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 disabled:opacity-50"
              >
                {submitting ? 'Saving to EHR...' : 'Save Clinical Record to EHR'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* History list */
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No consultation records found</h3>
              <p className="text-slate-500 text-xs mt-1">Start by adding your first clinical examination note above.</p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {rec.diagnosis}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Patient: <span className="font-bold text-slate-800">{rec.patientId?.userId?.name || 'Patient'}</span> • Phone: {rec.patientId?.userId?.phone || 'N/A'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full w-fit">
                    {new Date(rec.recordDate || rec.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="font-bold text-slate-700 block mb-1">Symptoms:</span>
                    <p>{Array.isArray(rec.symptoms) ? rec.symptoms.join(', ') : rec.symptoms}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="font-bold text-slate-700 block mb-1">Treatment Plan:</span>
                    <p>{rec.treatmentPlan || 'Standard care regimen'}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-indigo-50/40 p-3 rounded-xl">
                  <span className="font-bold text-indigo-950 block mb-1">Clinical Notes:</span>
                  <p>{rec.consultationNotes}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorConsultation;
