import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  getDoctorDashboard,
  updateAppointmentStatus
} from '../../services/doctorService';
import {
  Stethoscope,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Pill,
  UserCheck,
  Check,
  X
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDoctorDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setActionLoading(true);
      const res = await updateAppointmentStatus(appointmentId, status);
      if (res.success) {
        setMessage({ text: `Appointment successfully marked as ${status}!`, type: 'success' });
        fetchDashboard();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update appointment status',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 font-medium">Loading clinical workspace...</p>
        </div>
      </div>
    );
  }

  const doctor = data?.doctor;
  const stats = data?.stats || {};
  const isApproved = doctor?.approvalStatus === 'approved';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Alert Banner */}
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

      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Clinical Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dr. {user?.name || doctor?.userId?.name || 'Healthcare Practitioner'}
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm">
              Specialization: <span className="font-semibold text-white">{doctor?.specialization || 'General Physician'}</span> • Clinic/Hospital: <span className="font-semibold text-white">{doctor?.hospitalOrClinic || 'Primary Health Centre'}</span> • License: <span className="font-mono text-white">{doctor?.licenseNumber || 'MED-REG-RURAL'}</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right flex-shrink-0">
            <span className="block text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
              Medical Verification
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mt-1.5 ${
                isApproved
                  ? 'bg-emerald-400 text-slate-900'
                  : 'bg-amber-300 text-slate-900'
              }`}
            >
              {isApproved ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {doctor?.approvalStatus?.toUpperCase() || 'VERIFIED'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Today's Queue</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
              {stats.todaysCount || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for today</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending Requests</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {stats.pendingCount || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Awaiting your approval</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Patients Treated</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">
              {stats.totalPatientCount || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">In your health network</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Sessions</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {stats.completedAppointments || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Successful checkups</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Quick Clinical Actions</h4>
          <p className="text-xs text-slate-500">Fast shortcuts for daily patient treatment and documentation</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/doctor/consultation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
          >
            <ClipboardList className="w-4 h-4" />
            Write Clinical EHR Note
          </Link>
          <Link
            to="/doctor/prescriptions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-200"
          >
            <Pill className="w-4 h-4" />
            Issue Digital Prescription
          </Link>
          <Link
            to="/doctor/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition"
          >
            <Calendar className="w-4 h-4" />
            Manage All Appointments
          </Link>
        </div>
      </div>

      {/* Main Grid: Today's Queue & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Today's Appointment Schedule</h3>
            </div>
            <Link
              to="/doctor/appointments"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!data?.todaysAppointments || data.todaysAppointments.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.todaysAppointments.map((apt) => (
                <div key={apt._id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 text-sm">
                        {apt.patientId?.userId?.name || 'Rural Patient'}
                      </p>
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {apt.appointmentTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Reason: {apt.reasonForVisit || 'Regular consultation'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(apt._id, 'completed')}
                        disabled={actionLoading}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                      >
                        Complete
                      </button>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : apt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Requests Queue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Pending Appointment Requests</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {data?.pendingRequests?.length || 0} Pending
            </span>
          </div>

          {!data?.pendingRequests || data.pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
              <p className="text-xs">Your appointment queue is completely clear!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.pendingRequests.map((req) => (
                <div key={req._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 text-sm">
                        {req.patientId?.userId?.name || 'Patient'}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {new Date(req.appointmentDate).toLocaleDateString()} at {req.appointmentTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Symptoms: <span className="text-slate-700">{req.reasonForVisit}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(req._id, 'confirmed')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, 'rejected')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
