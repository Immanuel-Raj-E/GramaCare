import React, { useState, useEffect } from 'react';
import * as patientService from '../../services/patientService';
import {
  Bell,
  CheckCircle,
  Calendar,
  Pill,
  UploadCloud,
  MessageSquare,
  Activity,
  Check,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await patientService.getNotifications();
      if (res.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      setErrorMsg('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await patientService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await patientService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-indigo-600" />;
      case 'report':
        return <UploadCloud className="w-4 h-4 text-teal-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Alerts & Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Updates on appointment confirmations, new prescriptions, and doctor messages.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            Mark All as Read
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Loading alerts...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                n.isRead ? 'bg-white border-slate-200/80' : 'bg-emerald-50/50 border-emerald-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{n.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 transition flex-shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">You are all caught up with your healthcare alerts.</p>
        </div>
      )}
    </div>
  );
};

export default PatientNotifications;
