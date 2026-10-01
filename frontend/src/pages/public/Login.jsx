import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { HeartPulse, Lock, Mail, AlertCircle, ArrowRight, Shield, Stethoscope, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email address and password');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      const role = result.user.role;
      const redirectPath = location.state?.from?.pathname || (
        role === 'doctor' ? '/doctor/dashboard' :
        role === 'admin' ? '/admin/dashboard' :
        '/patient/dashboard'
      );
      navigate(redirectPath, { replace: true });
    } else {
      setLocalError(result.message || 'Invalid credentials');
    }
  };

  // Demo Credentials Helper (For Viva Evaluation & Quick Demonstration)
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLocalError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 mb-3">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to GramaCare
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Secure health access for patients, doctors, and administrators
          </p>
        </div>

        {/* Demo Quick-Fill Bar (Ideal for College Viva Evaluation) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>Demo Quick-Fill:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@gramacare.org', 'Admin@12345')}
              className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition"
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('dr_sharma@ruralhealth.org', 'Password@123')}
              className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition"
            >
              <Stethoscope className="w-3 h-3" /> Doctor
            </button>
            <button
              type="button"
              onClick={() => fillDemo('ramesh_patel@ruralhealth.org', 'Password@123')}
              className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium transition"
            >
              <User className="w-3 h-3" /> Patient
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{localError}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 space-y-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-200 disabled:opacity-50 transition"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Register as Patient or Doctor
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
