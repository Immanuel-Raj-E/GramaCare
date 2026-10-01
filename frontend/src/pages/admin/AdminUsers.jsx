import React, { useState, useEffect } from 'react';
import { getAllUsers, toggleUserStatus } from '../../services/adminService';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  Stethoscope,
  User,
  Filter,
  AlertCircle
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers({ role: roleFilter, search });
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggle = async (userId, currentStatus) => {
    try {
      setActionLoading(true);
      const res = await toggleUserStatus(userId, !currentStatus);
      if (res.success) {
        setMessage({
          text: `User account ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
          type: 'success'
        });
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update user status',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform User Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Audit registered accounts, oversee security roles, and manage active platform access.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-xs"
          />
        </form>
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

      {/* Role Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {['all', 'patient', 'doctor', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition ${
              roleFilter === role
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {role === 'all' ? 'All Roles' : `${role}s`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs">Loading user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold text-slate-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                          u.role === 'doctor'
                            ? 'bg-indigo-100 text-indigo-800'
                            : u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {u.phone || 'N/A'}
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggle(u._id, u.isActive)}
                        disabled={actionLoading}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                          u.isActive
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
