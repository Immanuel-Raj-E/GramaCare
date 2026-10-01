import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import * as patientService from '../../services/patientService';
import {
  MessageSquare,
  Send,
  User,
  Stethoscope,
  Clock,
  AlertCircle,
  CheckCheck,
  Check
} from 'lucide-react';

const PatientMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [convRes, docsRes] = await Promise.all([
        patientService.getConversations(),
        patientService.getApprovedDoctors()
      ]);

      if (convRes.success) setConversations(convRes.data);
      if (docsRes.success) setApprovedDoctors(docsRes.data);

      // Auto-select first conversation partner if available, otherwise first doctor
      if (convRes.success && convRes.data.length > 0) {
        setSelectedPartner(convRes.data[0].partner);
      } else if (docsRes.success && docsRes.data.length > 0) {
        setSelectedPartner(docsRes.data[0].userId);
      }
    } catch (err) {
      setErrorMsg('Failed to load message conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadThread = async (partnerId) => {
    try {
      const res = await patientService.getMessagesWithUser(partnerId);
      if (res.success) {
        setMessages(res.data);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    }
  };

  useEffect(() => {
    if (selectedPartner?._id) {
      loadThread(selectedPartner._id);
    }
  }, [selectedPartner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner?._id) return;

    setSending(true);
    try {
      const res = await patientService.sendMessage(selectedPartner._id, newMessage.trim());
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (err) {
      setErrorMsg('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Communication</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct messaging with your healthcare practitioners regarding symptoms, medicines, and appointments.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Left Column: Conversation Partners */}
        <div className="border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Healthcare Contacts
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {approvedDoctors.map((doc) => {
              const isSelected = selectedPartner?._id === doc.userId?._id;
              return (
                <button
                  key={doc._id}
                  onClick={() => setSelectedPartner(doc.userId)}
                  className={`w-full p-4 text-left flex items-center gap-3 transition ${
                    isSelected ? 'bg-emerald-50 border-r-4 border-emerald-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold flex-shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {doc.userId?.name || 'Practitioner'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {doc.specialization} • {doc.hospitalOrClinic}
                    </p>
                  </div>
                </button>
              );
            })}

            {approvedDoctors.length === 0 && (
              <p className="p-6 text-center text-xs text-slate-400">No healthcare contacts available.</p>
            )}
          </div>
        </div>

        {/* Right Column: Chat Messages */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {selectedPartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {selectedPartner.name}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-medium capitalize">
                    Verified Healthcare Professional
                  </span>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
                {messages.length > 0 ? (
                  messages.map((m) => {
                    const isMe = m.senderId?._id === user?.id || m.senderId === user?.id;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm shadow-xs ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMe ? 'text-emerald-100' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isMe && (m.readStatus ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">No prior conversation with this doctor.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Send a message to initiate communication.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  placeholder="Type health question or message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-slate-400 p-8">
              Select a doctor from the left to start consultation messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
