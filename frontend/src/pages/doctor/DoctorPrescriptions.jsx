import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDoctorPatients,
  createPrescription,
  getPrescriptions
} from '../../services/doctorService';
import {
  Pill,
  Plus,
  Trash2,
  Printer,
  History,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  FileText
} from 'lucide-react';

const DoctorPrescriptions = () => {
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [patientId, setPatientId] = useState(initialPatientId);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [medicines, setMedicines] = useState([
    {
      medicineName: '',
      dosage: '',
      frequency: 'Twice daily (1-0-1)',
      duration: '5 days',
      instructions: 'Take after food'
    }
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patRes, rxRes] = await Promise.all([
        getDoctorPatients(),
        getPrescriptions()
      ]);
      if (patRes.success) {
        setPatients(patRes.data);
        if (!patientId && patRes.data.length > 0) {
          setPatientId(patRes.data[0]._id);
        }
      }
      if (rxRes.success) {
        setPrescriptions(rxRes.data);
      }
    } catch (err) {
      console.error('Failed to load prescription data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: '',
        dosage: '',
        frequency: 'Twice daily (1-0-1)',
        duration: '5 days',
        instructions: 'Take after food'
      }
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length === 1) {
      setMessage({ text: 'A prescription must contain at least one medicine', type: 'error' });
      return;
    }
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      setMessage({ text: 'Please select a patient', type: 'error' });
      return;
    }

    // Validate medicines
    for (const med of medicines) {
      if (!med.medicineName.trim() || !med.dosage.trim()) {
        setMessage({ text: 'Please enter medicine name and dosage for all items', type: 'error' });
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await createPrescription({
        patientId,
        medicines,
        generalInstructions
      });
      if (res.success) {
        setMessage({ text: 'Digital prescription issued successfully!', type: 'success' });
        setMedicines([
          {
            medicineName: '',
            dosage: '',
            frequency: 'Twice daily (1-0-1)',
            duration: '5 days',
            instructions: 'Take after food'
          }
        ]);
        setGeneralInstructions('');
        fetchData();
        setActiveTab('history');
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to issue prescription',
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Prescription Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Create structured digital prescriptions and view past dispensary records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'new'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" /> Issue New Rx
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'history'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" /> Past Prescriptions ({prescriptions.length})
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
        /* Issue Prescription Form */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Prescribe For Patient *
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full sm:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {patients.length === 0 ? (
                  <option value="">No patients available</option>
                ) : (
                  patients.map((pat) => (
                    <option key={pat._id} value={pat._id}>
                      {pat.userId?.name || 'Patient'} ({pat.userId?.phone || 'No phone'}) - {pat.address?.village || 'Village'}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Medicines List Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-indigo-600" />
                  Prescribed Medicines
                </h3>
                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Medicine Name & Strength *
                      </label>
                      <input
                        type="text"
                        value={med.medicineName}
                        onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                        placeholder="e.g. Paracetamol 500mg"
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        placeholder="e.g. 1 Tablet"
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Frequency *
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        placeholder="e.g. 1-0-1"
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        placeholder="e.g. 5 days"
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                        placeholder="After food"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-center pb-1">
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(index)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                General Diet & Care Instructions
              </label>
              <textarea
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                rows={3}
                placeholder="Drink plenty of boiled water. Avoid strenuous work under sun. Visit health centre if symptoms worsen..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 disabled:opacity-50"
              >
                {submitting ? 'Generating Rx...' : 'Issue Prescription'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Prescriptions History */
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No prescriptions issued yet</h3>
              <p className="text-slate-500 text-xs mt-1">Issue a new prescription to see it listed here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map((rx) => (
                <div
                  key={rx._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-bold">
                        Rx #{rx._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {rx.patientId?.userId?.name || 'Patient'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Phone: {rx.patientId?.userId?.phone || 'N/A'} • {rx.medicines?.length || 0} Medicine(s)
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs">
                      {rx.medicines?.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700">
                          <span className="font-bold">{m.medicineName}</span>
                          <span className="text-slate-500">{m.dosage} • {m.frequency}</span>
                        </div>
                      ))}
                    </div>

                    {rx.generalInstructions && (
                      <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                        "{rx.generalInstructions}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => setSelectedPrescription(rx)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> View / Print Rx
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Printable Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Rx Header */}
            <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">GRAMACARE RURAL HEALTH</h2>
                <p className="text-xs text-slate-600">Primary Health & Digital Dispensary Care</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 font-serif">Rx</span>
                <p className="text-[10px] text-slate-500 font-mono">
                  #{selectedPrescription._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Patient & Doctor details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase">Patient Details:</span>
                <p className="font-extrabold text-slate-900 text-sm">
                  {selectedPrescription.patientId?.userId?.name || 'Patient'}
                </p>
                <p className="text-slate-600">Contact: {selectedPrescription.patientId?.userId?.phone || 'N/A'}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold block uppercase">Prescribing Doctor:</span>
                <p className="font-extrabold text-slate-900 text-sm">
                  Dr. {selectedPrescription.doctorId?.userId?.name || 'Doctor'}
                </p>
                <p className="text-slate-600">
                  Date: {new Date(selectedPrescription.createdAt).toDateString()}
                </p>
              </div>
            </div>

            {/* Medicines Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Medicine</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPrescription.medicines?.map((med, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{med.medicineName}</td>
                      <td className="p-3 text-slate-600">{med.dosage}</td>
                      <td className="p-3 text-slate-600">{med.frequency}</td>
                      <td className="p-3 text-slate-600">{med.duration}</td>
                      <td className="p-3 text-slate-600">{med.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedPrescription.generalInstructions && (
              <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Doctor's Notes & Advice:</span>
                <p>{selectedPrescription.generalInstructions}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
