import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../../services/adminService';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAllAppointments({ status: statusFilter });
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Failed to load system appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Appointments Log</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Global audit and oversight of all clinic appointments across the GramaCare network.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition ${
              statusFilter === status
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'All Statuses' : status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs">Loading appointments log...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold text-slate-600">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Assigned Doctor</th>
                  <th className="p-4">Date & Slot</th>
                  <th className="p-4">Visit Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Doctor Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => {
                  const patientUser = apt.patientId?.userId;
                  const doctorUser = apt.doctorId?.userId;

                  return (
                    <tr key={apt._id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0">
                            {patientUser?.name ? patientUser.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {patientUser?.name || 'Patient'}
                            </p>
                            <p className="text-[11px] text-slate-400">{patientUser?.phone || 'No phone'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              Dr. {doctorUser?.name || 'Doctor'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {apt.doctorId?.specialization || 'General'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800">
                          {new Date(apt.appointmentDate).toDateString()}
                        </p>
                        <span className="font-mono text-purple-700 text-[11px] font-semibold">
                          {apt.appointmentTime}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        "{apt.reasonForVisit}"
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
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
                      </td>

                      <td className="p-4 text-slate-500 text-[11px] max-w-xs truncate italic">
                        {apt.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
