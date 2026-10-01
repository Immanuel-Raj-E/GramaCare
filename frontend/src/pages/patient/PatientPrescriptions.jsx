import React, { useState, useEffect } from 'react';
import * as patientService from '../../services/patientService';
import {
  Pill,
  Calendar,
  Stethoscope,
  Printer,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await patientService.getPrescriptions();
      if (res.success) {
        setPrescriptions(res.data);
      } else {
        setErrorMsg('Failed to load prescriptions');
      }
    } catch (err) {
      setErrorMsg('Error loading prescriptions from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handlePrint = (prescId) => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access, view dosage schedules, and print digital prescriptions issued by your doctors.
          </p>
        </div>
      </div>

      {/* Security Rule Notice Banner */}
      <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-900">
        <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        <span>
          <strong>Prescription Authority:</strong> Prescriptions are digitally generated exclusively by certified doctors. Patients cannot alter medication dosages or instructions.
        </span>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Prescriptions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Loading your digital prescriptions...</p>
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="space-y-6">
          {prescriptions.map((presc) => (
            <div
              key={presc._id}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 print:border-none print:shadow-none"
            >
              {/* Prescription Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">
                      Prescribed by {presc.doctorId?.userId?.name || 'Practitioner'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {presc.doctorId?.qualification} • {presc.doctorId?.hospitalOrClinic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(presc.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <button
                    onClick={() => handlePrint(presc._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition print:hidden"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    Print Rx
                  </button>
                </div>
              </div>

              {/* Medicines Schedule Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                  <thead className="bg-slate-50/80 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Medicine Name</th>
                      <th className="py-2.5 px-3">Dosage</th>
                      <th className="py-2.5 px-3">Frequency</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {presc.medicines?.map((med, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-400">{index + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{med.medicineName}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                            {med.dosage}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">{med.frequency}</td>
                        <td className="py-3 px-3 font-medium text-slate-700">{med.duration}</td>
                        <td className="py-3 px-3 text-slate-600">{med.instructions || 'As advised'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* General Instructions */}
              {presc.generalInstructions && (
                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                  <strong className="text-slate-800">Special Instructions:</strong> {presc.generalInstructions}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No Prescriptions Issued</h3>
          <p className="text-xs text-slate-500 mt-1">
            When doctors prescribe medications during your consultations, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
