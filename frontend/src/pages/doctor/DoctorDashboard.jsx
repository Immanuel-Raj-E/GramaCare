import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Stethoscope, ShieldAlert, CheckCircle, Clock, Calendar, Users, FileText } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, profile } = useAuth();
  const isApproved = profile?.approvalStatus === 'approved';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-teal-50 mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Workspace • {profile?.specialization || 'Healthcare Practitioner'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1">
              Affiliation: {profile?.hospitalOrClinic || 'Primary Health Centre'} | License: {profile?.licenseNumber || 'N/A'} | Qualifications: {profile?.qualification || 'MBBS'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right">
            <span className="block text-xs uppercase tracking-wider text-teal-200">Approval Status</span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mt-1 ${
              isApproved
                ? 'bg-emerald-400 text-slate-900'
                : 'bg-amber-400 text-slate-900'
            }`}>
              {isApproved ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {profile?.approvalStatus?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
      </div>

      {/* Approval Status Banner */}
      {!isApproved && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900">
            <h4 className="font-bold mb-1">Account Awaiting Administrator Approval</h4>
            <p className="text-amber-800">
              Your medical license is undergoing verification. You can view your dashboard, but per healthcare regulations, you cannot accept new patient consultations or issue prescriptions until approved by an administrator.
            </p>
          </div>
        </div>
      )}

      {/* Doctor Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Appointment Queue</h3>
          <p className="text-xs text-slate-500 mt-1">Review appointment requests and manage daily clinic patient slots.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Connected Patients</h3>
          <p className="text-xs text-slate-500 mt-1">Access medical records and lab reports of authorized patients.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Consultation & Rx</h3>
          <p className="text-xs text-slate-500 mt-1">Document clinical EHR notes and generate structured digital prescriptions.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
