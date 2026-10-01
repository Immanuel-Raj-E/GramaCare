import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Shield, Users, UserCheck, Stethoscope, Activity, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300 mb-2">
              <Shield className="w-3.5 h-3.5" />
              Administrative Governance Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Signed in as: {user?.name} ({user?.email}) • Full system oversight
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-right">
            <span className="block text-xs uppercase tracking-wider text-indigo-300">Access Level</span>
            <span className="text-sm font-bold text-emerald-400">SUPER ADMIN</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Status Notice */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-indigo-950">Administrative Auth Verified</h4>
            <p className="text-xs text-indigo-700">Role-based JWT validated. Doctor approval and user management modules ready for Phase 9.</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-200 text-indigo-900">
          Role: admin
        </span>
      </div>

      {/* Admin Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Doctor Verification</h3>
          <p className="text-xs text-slate-500 mt-1">Review medical licenses and approve or reject pending doctor applications.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">User Directory</h3>
          <p className="text-xs text-slate-500 mt-1">Manage all patient and doctor accounts with active/inactive state toggles.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Platform Health</h3>
          <p className="text-xs text-slate-500 mt-1">Audit appointments, clinic distributions, and digital records system activity.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
