import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorPatients } from '../../services/doctorService';
import {
  Users,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  Pill,
  MessageSquare,
  Activity
} from 'lucide-react';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getDoctorPatients();
      if (res.success) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error('Failed to load doctor patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const term = search.toLowerCase();
    const name = patient.userId?.name?.toLowerCase() || '';
    const email = patient.userId?.email?.toLowerCase() || '';
    const phone = patient.userId?.phone?.toLowerCase() || '';
    const village = patient.address?.village?.toLowerCase() || '';
    return name.includes(term) || email.includes(term) || phone.includes(term) || village.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Connected Patients</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Patients who have booked visits or received care at your clinic.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, phone, village..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Patient Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Loading patient registry...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No connected patients found</h3>
          <p className="text-slate-500 text-xs mt-1">
            When patients book appointments with you, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const user = patient.userId;
            return (
              <div
                key={patient._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-lg flex items-center justify-center flex-shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {user?.name || 'Rural Patient'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Blood Group: <span className="font-bold text-indigo-600">{patient.bloodGroup || 'O+'}</span> • Gender: {patient.gender || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user?.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{user?.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {patient.address?.village || 'Gram'} • {patient.address?.district || 'District'}
                      </span>
                    </div>
                  </div>

                  {patient.chronicDiseases && patient.chronicDiseases.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Chronic Conditions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {patient.chronicDiseases.map((cond, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Patient Quick Action Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/doctor/consultation?patientId=${patient._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    <ClipboardList className="w-3.5 h-3.5" /> Consult EHR
                  </Link>
                  <Link
                    to={`/doctor/prescriptions?patientId=${patient._id}`}
                    className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                    title="Write Prescription"
                  >
                    <Pill className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/doctor/messages?userId=${user?._id}`}
                    className="inline-flex items-center justify-center p-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
                    title="Send Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
