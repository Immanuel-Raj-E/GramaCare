import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { HeartPulse, LogOut, User, Shield, Stethoscope, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickSwitch = async (role) => {
    if (role === 'patient') {
      await login('ramesh_patel@ruralhealth.org', 'Password@123');
      navigate('/patient/dashboard');
    } else if (role === 'doctor') {
      await login('dr_sharma@ruralhealth.org', 'Password@123');
      navigate('/doctor/dashboard');
    } else if (role === 'admin') {
      await login('admin@gramacare.org', 'Admin@12345');
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">GramaCare</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Demo Mode
              </span>
            </div>
          </Link>

          {/* Direct Portal Switcher for Seamless Demo */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs">
            <button
              onClick={() => handleQuickSwitch('patient')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                location.pathname.startsWith('/patient')
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-700 hover:bg-white/80'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>

            <button
              onClick={() => handleQuickSwitch('doctor')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                location.pathname.startsWith('/doctor')
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-white/80'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              onClick={() => handleQuickSwitch('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                location.pathname.startsWith('/admin')
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-white/80'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900">{user?.name}</span>
                  <span className="capitalize text-slate-500">({user?.role})</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                  title="Sign out of GramaCare"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
