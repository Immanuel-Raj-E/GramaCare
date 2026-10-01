import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import * as patientService from '../../services/patientService';
import {
  HeartPulse,
  Calendar,
  FileText,
  Pill,
  UploadCloud,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bell,
  Stethoscope
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await patientService.getDashboard();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error connecting to healthcare server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-sm">Loading health records & appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl max-w-lg mx-auto text-center my-12">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="font-bold text-rose-900 text-base">Unable to Load Dashboard</h3>
        <p className="text-xs sm:text-sm text-rose-700 mt-1 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { patient, upcomingAppointment, recentRecords, recentPrescriptions, recentNotifications, stats } = data || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-emerald-50 mb-2">
              <HeartPulse className="w-3.5 h-3.5" />
              Rural Healthcare Access • Patient Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {user?.name}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Village: {patient?.address?.village || 'Not set'}, District: {patient?.address?.district || 'Not set'} | Blood: {patient?.bloodGroup || 'Unknown'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right">
            <span className="block text-xs uppercase tracking-wider text-emerald-200">Patient ID</span>
            <span className="text-sm font-mono font-bold">{user?.id?.slice(-8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalAppointments || 0}</span>
            <p className="text-xs text-slate-500 font-medium">Appointments</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalRecords || 0}</span>
            <p className="text-xs text-slate-500 font-medium">Consultations (EHR)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalPrescriptions || 0}</span>
            <p className="text-xs text-slate-500 font-medium">Prescriptions</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalReports || 0}</span>
            <p className="text-xs text-slate-500 font-medium">Medical Reports</p>
          </div>
        </div>
      </div>

      {/* 3. Upcoming Appointment & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Appointment */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Upcoming Appointment
            </h2>
            <Link to="/patient/appointments" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {upcomingAppointment.doctorId?.userId?.name || 'Healthcare Doctor'}
                    </span>
                    <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      upcomingAppointment.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {upcomingAppointment.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {upcomingAppointment.doctorId?.specialization} • {upcomingAppointment.doctorId?.hospitalOrClinic}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    <strong>Reason:</strong> {upcomingAppointment.reason}
                  </p>
                </div>
                <div className="text-left sm:text-right bg-white p-3.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    {new Date(upcomingAppointment.appointmentDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{upcomingAppointment.appointmentTime}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Upcoming Appointments</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Need to consult a healthcare doctor? Book your appointment slot online.
              </p>
              <Link
                to="/patient/appointments"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-emerald-700 transition"
              >
                Schedule Appointment
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 transition text-xs font-semibold text-slate-700 border border-slate-200/60"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Book Doctor Appointment
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/patient/reports')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 transition text-xs font-semibold text-slate-700 border border-slate-200/60"
            >
              <span className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-teal-600" />
                Upload Lab / Medical Report
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/patient/prescriptions')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 transition text-xs font-semibold text-slate-700 border border-slate-200/60"
            >
              <span className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-indigo-600" />
                View Prescriptions & Dosages
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/patient/profile')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-700 border border-slate-200/60"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600" />
                Update Village & Profile Info
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent EHR Records & Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent EHR Records */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Recent Consultations (EHR)
            </h3>
            <Link to="/patient/records" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          {recentRecords && recentRecords.length > 0 ? (
            <div className="space-y-3">
              {recentRecords.map((rec) => (
                <div key={rec._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{rec.diagnosis || 'Clinical Consultation'}</span>
                    <span className="text-slate-500 font-normal">{new Date(rec.recordDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Doctor: {rec.doctorId?.userId?.name || 'Practitioner'}
                  </p>
                  <p className="text-slate-500 truncate mt-0.5">Notes: {rec.consultationNotes}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No consultation records recorded yet.</p>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-600" />
              Recent Prescriptions
            </h3>
            <Link to="/patient/prescriptions" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          {recentPrescriptions && recentPrescriptions.length > 0 ? (
            <div className="space-y-3">
              {recentPrescriptions.map((presc) => (
                <div key={presc._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{presc.medicines?.length || 0} Prescribed Medicine(s)</span>
                    <span className="text-slate-500 font-normal">{new Date(presc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Doctor: {presc.doctorId?.userId?.name || 'Practitioner'}
                  </p>
                  <p className="text-slate-500 truncate mt-0.5">
                    {presc.medicines?.map((m) => `${m.medicineName} (${m.dosage})`).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No prescriptions issued yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
