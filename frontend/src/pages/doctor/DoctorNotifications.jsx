import React, { useState, useEffect } from 'react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../../services/doctorService';
import { Bell, Check, CheckCheck, Clock, Calendar, AlertCircle } from 'lucide-react';

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await markNotificationRead(id);
      if (res.success) {
        setNotifications(
          notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionLoading(true);
      const res = await markAllNotificationsRead();
      if (res.success) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Notifications</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Stay updated with appointment bookings, patient updates, and system alerts.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No notifications yet</h3>
          <p className="text-slate-500 text-xs mt-1">
            You're all caught up with your clinical alerts!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200/80'
                  : 'bg-indigo-50/50 border-indigo-200 shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{notif.title}</h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{notif.message}</p>
                <span className="text-[11px] text-slate-400 block pt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkRead(notif._id)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorNotifications;
