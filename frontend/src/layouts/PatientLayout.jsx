import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  LayoutDashboard,
  User,
  Calendar,
  FileText,
  Pill,
  UploadCloud,
  MessageSquare,
  Bell,
  Menu,
  X,
  HeartPulse
} from 'lucide-react';

const PatientLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/patient/profile', icon: User },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Medical Records', path: '/patient/records', icon: FileText },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { name: 'Medical Reports', path: '/patient/reports', icon: UploadCloud },
    { name: 'Messages', path: '/patient/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/patient/notifications', icon: Bell }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-slate-800 text-sm">Patient Portal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200/80 flex-shrink-0 z-40`}
      >
        <div className="p-4 sm:p-5">
          <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 mb-6">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Patient Account
            </span>
            <p className="font-bold text-slate-900 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
