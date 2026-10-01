import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, HeartPulse, UserCheck, Stethoscope } from 'lucide-react';

function App() {
  const [backendStatus, setBackendStatus] = useState({ loading: true, online: false, message: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then((res) => {
        setBackendStatus({ loading: false, online: true, message: res.data.message });
      })
      .catch(() => {
        setBackendStatus({ loading: false, online: false, message: 'Backend not reached' });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 text-slate-800 flex flex-col justify-between">
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">GramaCare</h1>
              <p className="text-xs text-slate-500 font-medium">Rural Healthcare Management Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              backendStatus.online 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {backendStatus.loading ? 'Checking Backend...' : backendStatus.online ? 'API Online' : 'Connecting to API'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-6">
          <Activity className="w-4 h-4 text-emerald-600" /> Phase 1 & 2: Environment, Core Setup & Schemas Complete
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl leading-tight">
          Empowering Rural Communities with Centralized Digital Healthcare
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl">
          Unified Electronic Health Records, structured prescriptions, secure appointment scheduling, and doctor-patient communication built with the MERN stack.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Patient Experience</h3>
            <p className="text-sm text-slate-600">Access full medical history, lab reports, doctor consultation notes, and schedule appointments.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Doctor Workspace</h3>
            <p className="text-sm text-slate-600">Review patient records, conduct consultations, issue multi-medicine prescriptions, and track queues.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Security & Privacy</h3>
            <p className="text-sm text-slate-600">Role-based JWT access control, strict clinical authorization guards, and encrypted credentials.</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono w-full max-w-xl text-left border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
            <span>System Status</span>
            <span className="text-emerald-400">Phase 1 & 2 Ready</span>
          </div>
          <div>Stack: MERN (React, Express, Node, MongoDB)</div>
          <div>Database: MongoDB (9 Mongoose Schemas configured)</div>
          <div>Backend API: {backendStatus.online ? backendStatus.message : 'Waiting for Express server...'}</div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/50 text-center py-4 text-xs text-slate-500">
        GramaCare Platform – Semester Full Stack Development Project
      </footer>
    </div>
  );
}

export default App;
