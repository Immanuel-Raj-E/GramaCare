import React, { useState, useEffect } from 'react';
import * as patientService from '../../services/patientService';
import {
  FileText,
  Calendar,
  Stethoscope,
  Clock,
  Search,
  AlertCircle,
  Eye,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await patientService.getMedicalRecords();
      if (res.success) {
        setRecords(res.data);
      } else {
        setErrorMsg('Failed to load medical records');
      }
    } catch (err) {
      setErrorMsg('Error loading records from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorId?.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.symptoms?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Electronic Health Records (EHR)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lifetime digital clinical history, symptoms, doctor consultation notes, and treatment plans.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search diagnosis or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Security Rule Notice Banner */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          <strong>Clinical Integrity Note:</strong> Electronic health consultation records are authored exclusively by verified medical practitioners and are preserved in read-only form for your safety.
        </span>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Record Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Loading health records...</p>
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec._id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base">{rec.diagnosis}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-medium border border-teal-100">
                    Clinical Record
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(rec.recordDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 ml-2"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Treating Practitioner:</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                    {rec.doctorId?.userId?.name || 'Practitioner'}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Reported Symptoms:</span>
                  <div className="flex flex-wrap gap-1">
                    {rec.symptoms?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                <strong className="text-slate-800">Doctor's Consultation Notes:</strong>
                <p className="mt-1 line-clamp-2">{rec.consultationNotes}</p>
              </div>

              {rec.followUpDate && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Scheduled Follow-up: {new Date(rec.followUpDate).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No Health Records Available</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? 'No records match your search criteria.' : 'Your consultation records will appear here after doctor visits.'}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-600 block">
                  Official Medical Consultation Record
                </span>
                <h2 className="text-lg font-bold text-slate-900">{selectedRecord.diagnosis}</h2>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-500 block text-[11px]">Doctor</span>
                  <strong className="text-slate-800">{selectedRecord.doctorId?.userId?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date</span>
                  <strong className="text-slate-800">
                    {new Date(selectedRecord.recordDate).toLocaleDateString('en-IN')}
                  </strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Symptoms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecord.symptoms?.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Clinical Consultation Notes:</span>
                <div className="p-3.5 bg-slate-50 rounded-xl text-slate-700 leading-relaxed text-xs">
                  {selectedRecord.consultationNotes}
                </div>
              </div>

              {selectedRecord.treatmentPlan && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Treatment Plan:</span>
                  <div className="p-3.5 bg-slate-50 rounded-xl text-slate-700 leading-relaxed text-xs">
                    {selectedRecord.treatmentPlan}
                  </div>
                </div>
              )}

              {selectedRecord.followUpInstructions && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Follow-up Instructions:</span>
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900 text-xs">
                    {selectedRecord.followUpInstructions}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
