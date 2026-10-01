import React, { useState, useEffect } from 'react';
import {
  getDoctorApplications,
  updateDoctorApproval
} from '../../services/adminService';
import {
  UserCheck,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Award,
  Clock,
  Check,
  X,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [approvalAction, setApprovalAction] = useState('approved');
  const [remarks, setRemarks] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getDoctorApplications();
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error('Failed to load doctor applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openActionModal = (doc, status) => {
    setSelectedDoctor(doc);
    setApprovalAction(status);
    setRemarks(
      status === 'approved'
        ? 'Medical credentials and license successfully verified.'
        : 'License verification could not be validated.'
    );
    setShowModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedDoctor) return;
    try {
      setActionLoading(true);
      const res = await updateDoctorApproval(selectedDoctor._id, approvalAction, remarks);
      if (res.success) {
        setMessage({
          text: `Doctor application marked as ${approvalAction.toUpperCase()}!`,
          type: 'success'
        });
        setShowModal(false);
        fetchDoctors();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update approval status',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (activeTab === 'all') return true;
    return doc.approvalStatus === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Verification Queue</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Audit medical licenses, qualifications, and authorize doctors for clinical consultations.
          </p>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Loading verification records...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No doctor applications found</h3>
          <p className="text-slate-500 text-xs mt-1">There are no doctors with status "{activeTab}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const user = doc.userId;
            const isApproved = doc.approvalStatus === 'approved';
            const isPending = doc.approvalStatus === 'pending';

            return (
              <div
                key={doc._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.approvalStatus}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Reg: {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-extrabold text-base flex-shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        Dr. {user?.name || 'Practitioner'}
                      </h4>
                      <p className="text-xs text-purple-700 font-semibold">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">License:</span>
                      <span className="font-bold text-slate-800 font-mono">{doc.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Affiliation:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                        {doc.hospitalOrClinic}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Experience:</span>
                      <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 font-medium">Contact:</span>
                      <span className="font-mono text-slate-700">{user?.phone || user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => openActionModal(doc, 'approved')}
                    disabled={isApproved || actionLoading}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                      isApproved
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => openActionModal(doc, 'rejected')}
                    disabled={doc.approvalStatus === 'rejected' || actionLoading}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                      doc.approvalStatus === 'rejected'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Confirm Doctor {approvalAction === 'approved' ? 'Approval' : 'Rejection'}
            </h3>
            <p className="text-xs text-slate-500">
              You are updating the verified medical status for{' '}
              <span className="font-bold text-slate-800">
                Dr. {selectedDoctor.userId?.name}
              </span>{' '}
              (License: {selectedDoctor.licenseNumber}).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Verification Notes / Remarks:
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={actionLoading}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition ${
                  approvalAction === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionLoading ? 'Updating...' : `Confirm ${approvalAction.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
