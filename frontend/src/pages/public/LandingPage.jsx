import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, UserCheck, Stethoscope, ShieldCheck, ArrowRight, FileText, Calendar, MessageSquare } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            Rural Healthcare Management and Digital Health Record Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Connecting Rural Villages with <br className="hidden sm:inline" />
            <span className="text-emerald-700">Centralized Digital Care</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            GramaCare eliminates lost paper prescriptions and fragmented records. We empower rural families, doctors, and primary health clinics with unified electronic health records and seamless consultations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 transition"
            >
              Sign In to Your Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200 shadow-sm transition"
            >
              New Registration
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Modules Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built for Rural Healthcare Realities</h2>
          <p className="text-slate-600 text-sm mt-2">Simple, intuitive, and accessible workflows designed for community well-being.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Patient */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Patient Portal</h3>
            <p className="text-sm text-slate-600 mb-4">
              Book appointments with verified doctors, maintain lifetime medical records, store lab reports safely, and review digital prescriptions anytime.
            </p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-teal-600" /> Easy appointment booking</li>
              <li className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-teal-600" /> Lifetime electronic health record</li>
              <li className="flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-teal-600" /> Direct doctor messaging</li>
            </ul>
          </div>

          {/* Card 2: Doctor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Doctor Workspace</h3>
            <p className="text-sm text-slate-600 mb-4">
              Manage clinical queues, view verified patient histories, record diagnosis and consultation notes, and generate clear digital prescriptions.
            </p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> Queue & availability management</li>
              <li className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-emerald-600" /> Structured multi-medicine Rx</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Medical council verified credentials</li>
            </ul>
          </div>

          {/* Card 3: Security & Administration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verification & Governance</h3>
            <p className="text-sm text-slate-600 mb-4">
              Strict administrator verification for doctor licenses ensuring rural patients are only treated by certified healthcare professionals.
            </p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Mandatory doctor approval</li>
              <li className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-indigo-600" /> Privacy-first role authorization</li>
              <li className="flex items-center gap-2"><HeartPulse className="w-3.5 h-3.5 text-indigo-600" /> Zero sensitive data leakage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>GramaCare Platform – Semester Project for Rural Healthcare Management</p>
      </footer>
    </div>
  );
};

export default LandingPage;
