import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getDoctorProfile, updateDoctorProfile } from '../../services/doctorService';
import {
  User,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Award,
  Clock,
  IndianRupee,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: 'General Medicine',
    qualification: 'MBBS',
    experienceYears: 5,
    hospitalOrClinic: 'Primary Health Centre',
    consultationFee: 0,
    licenseNumber: ''
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getDoctorProfile();
      if (res.success) {
        const doc = res.data;
        setFormData({
          name: doc.userId?.name || user?.name || '',
          phone: doc.userId?.phone || user?.phone || '',
          email: doc.userId?.email || user?.email || '',
          specialization: doc.specialization || 'General Medicine',
          qualification: doc.qualification || 'MBBS',
          experienceYears: doc.experienceYears || 5,
          hospitalOrClinic: doc.hospitalOrClinic || 'Primary Health Centre',
          consultationFee: doc.consultationFee || 0,
          licenseNumber: doc.licenseNumber || 'MED-REG-RURAL'
        });
      }
    } catch (err) {
      console.error('Failed to load doctor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateDoctorProfile(formData);
      if (res.success) {
        setMessage({ text: 'Doctor profile and clinic details updated successfully!', type: 'success' });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update doctor profile',
        type: 'error'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs">Loading doctor profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Profile & Clinic Timings</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Keep your medical credentials, clinic affiliation, and consultation parameters up to date.
        </p>
      </div>

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

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Personal & Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Doctor Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Medical License Number (Verified)</label>
            <input
              type="text"
              value={formData.licenseNumber}
              disabled
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        <div className="border-b border-slate-100 pb-4 pt-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Professional & Clinic Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialization *</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              placeholder="e.g. General Physician, Pediatrician, Gynecologist"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications *</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              placeholder="e.g. MBBS, MD (General Medicine)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience *</label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              min="0"
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹ INR)</label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              min="0"
              placeholder="0 for rural public health service"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic / Health Centre Name *</label>
            <input
              type="text"
              name="hospitalOrClinic"
              value={formData.hospitalOrClinic}
              onChange={handleChange}
              required
              placeholder="e.g. Primary Health Centre, Gram Baramati"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfile;
