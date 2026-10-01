import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getAdminStats } from '../../services/adminService';
import {
  Shield,
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 font-medium">Aggregating platform intelligence...</p>
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const recentUsers = data?.recentUsers || [];
  const recentAppointments = data?.recentAppointments || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-semibold text-purple-300">
              <Shield className="w-3.5 h-3.5" />
              Administrative Governance Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              GramaCare System Administration
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Logged in as: <span className="font-semibold text-white">{user?.name || 'Administrator'}</span> ({user?.email}) • Complete rural healthcare monitoring & verification.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center sm:text-right flex-shrink-0">
            <span className="block text-[11px] uppercase tracking-wider text-purple-300 font-semibold">
              Pending Doctor Approvals
            </span>
            <span className="text-2xl font-black text-amber-300 block mt-0.5">
              {counts.pendingDoctors || 0}
            </span>
            <Link
              to="/admin/doctors"
              className="text-[11px] text-purple-200 hover:text-white font-bold underline mt-1 block"
            >
              Review queue →
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
              {counts.totalUsers || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Patients, Doctors & Admins
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verified Doctors</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">
              {counts.approvedDoctors || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {counts.pendingDoctors || 0} awaiting approval
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Appointments</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">
              {counts.totalAppointments || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {counts.completedAppointments || 0} completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Health Records</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {counts.totalRecords || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {counts.totalPrescriptions || 0} prescriptions issued
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Admin Control Center</h4>
          <p className="text-xs text-slate-500">Quick shortcuts to manage verification and system oversight</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/doctors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-purple-700 transition shadow-sm shadow-purple-200"
          >
            <UserCheck className="w-4 h-4" />
            Verify Doctors ({counts.pendingDoctors || 0} pending)
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-900 transition"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition"
          >
            <Calendar className="w-4 h-4" />
            Appointments Log
          </Link>
        </div>
      </div>

      {/* System Tables: Recent Registrations & Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent User Registrations</h3>
            </div>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              All users <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentUsers.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      u.role === 'doctor'
                        ? 'bg-indigo-100 text-indigo-800'
                        : u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    title={u.isActive ? 'Active' : 'Inactive'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent Platform Appointments</h3>
            </div>
            <Link
              to="/admin/appointments"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              All appointments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAppointments.map((apt) => (
              <div key={apt._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">
                    {apt.patientId?.userId?.name || 'Patient'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Dr. {apt.doctorId?.userId?.name || 'Doctor'} • {new Date(apt.appointmentDate).toLocaleDateString()} {apt.appointmentTime}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
