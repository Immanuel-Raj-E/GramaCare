import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../../services/doctorService';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  FileText,
  Pill,
  Filter,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getDoctorAppointments();
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status, notes = '') => {
    try {
      setActionLoading(true);
      const res = await updateAppointmentStatus(appointmentId, status, notes);
      if (res.success) {
        setMessage({ text: `Appointment successfully marked as ${status}!`, type: 'success' });
        setShowCompleteModal(false);
        setCompletionNotes('');
        setSelectedAppointment(null);
        fetchAppointments();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update appointment',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      setActionLoading(true);
      const res = await cancelAppointment(appointmentId);
      if (res.success) {
        setMessage({ text: 'Appointment cancelled', type: 'success' });
        fetchAppointments();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to cancel appointment',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'all') return true;
    return apt.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Appointments Queue</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Review patient bookings, approve slots, and manage clinic consultations.
          </p>
        </div>
      </div>

      {/* Alert message */}
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

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No appointments found</h3>
          <p className="text-slate-500 text-xs mt-1">There are no appointments with status "{activeTab}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => {
            const patientUser = apt.patientId?.userId;
            return (
              <div
                key={apt._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : apt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      #{apt._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{patientUser?.name || 'Patient'}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {patientUser?.phone || 'No phone provided'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Date:</span>
                      <span className="font-bold text-slate-800">
                        {new Date(apt.appointmentDate).toDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Slot:</span>
                      <span className="font-bold text-indigo-600 font-mono">{apt.appointmentTime}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="font-semibold text-slate-500 block mb-0.5">Reason:</span>
                      <p className="text-slate-700 italic">"{apt.reasonForVisit}"</p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  {apt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(apt._id, 'confirmed')}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(apt._id, 'rejected')}
                        disabled={actionLoading}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}

                  {apt.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowCompleteModal(true);
                        }}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Complete Visit
                      </button>
                      <button
                        onClick={() => handleCancel(apt._id)}
                        disabled={actionLoading}
                        className="py-2 px-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {apt.status === 'completed' && (
                    <div className="w-full flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Visit Finished
                      </span>
                      <Link
                        to="/doctor/prescriptions"
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Prescriptions →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completion Notes Modal */}
      {showCompleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 text-lg">Mark Consultation as Completed</h3>
            <p className="text-xs text-slate-500">
              Provide summary consultation notes for{' '}
              <span className="font-bold text-slate-800">
                {selectedAppointment.patientId?.userId?.name}
              </span>
              .
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Consultation Summary / Doctor Notes:
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Patient examined. Vital signs normal. Prescribed routine course..."
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCompleteModal(false);
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleStatusChange(selectedAppointment._id, 'completed', completionNotes)
                }
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                {actionLoading ? 'Saving...' : 'Confirm Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
