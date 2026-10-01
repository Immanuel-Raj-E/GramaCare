import React from 'react';
import useAuth from '../../hooks/useAuth';
import { User, Activity, Calendar, FileText, Pill, ShieldCheck, HeartPulse } from 'lucide-react';

const PatientDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-emerald-50 mb-2">
              <HeartPulse className="w-3.5 h-3.5" />
              Patient Portal • Verified Session
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Village: {profile?.address?.village || 'Not specified'} | District: {profile?.address?.district || 'Not specified'} | Blood Group: {profile?.bloodGroup || 'Unknown'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right">
            <span className="block text-xs uppercase tracking-wider text-emerald-200">Patient ID</span>
            <span className="text-sm font-mono font-bold">{user?.id?.slice(-8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Quick Status Notice */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-900">Authentication Verified</h4>
            <p className="text-xs text-emerald-700">Role-based JWT session active. Full patient module routes ready for Phase 7.</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900">
          Role: patient
        </span>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Appointments</h3>
          <p className="text-xs text-slate-500 mt-1">Schedule and review clinic consultations with approved doctors.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Medical Records (EHR)</h3>
          <p className="text-xs text-slate-500 mt-1">Lifetime electronic health records and doctor consultation notes.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
            <Pill className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Prescriptions</h3>
          <p className="text-xs text-slate-500 mt-1">Digital medicine schedules and dosage instructions from treating doctors.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
