import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  getDoctorPatients,
  getConversations,
  getMessagesWithUser,
  sendMessage
} from '../../services/doctorService';
import {
  MessageSquare,
  Send,
  User,
  CheckCheck,
  Check,
  AlertCircle
} from 'lucide-react';

const DoctorMessages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId');

  const [patients, setPatients] = useState([]);
  const [selectedPatientUser, setSelectedPatientUser] = useState(null);
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
      const res = await getDoctorPatients();
      if (res.success && res.data.length > 0) {
        setPatients(res.data);
        if (queryUserId) {
          const matched = res.data.find((p) => p.userId?._id === queryUserId);
          if (matched) {
            setSelectedPatientUser(matched.userId);
          } else {
            setSelectedPatientUser(res.data[0].userId);
          }
        } else {
          setSelectedPatientUser(res.data[0].userId);
        }
      }
    } catch (err) {
      setErrorMsg('Failed to load patient contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadThread = async (userId) => {
    try {
      const res = await getMessagesWithUser(userId);
      if (res.success) {
        setMessages(res.data);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    }
  };

  useEffect(() => {
    if (selectedPatientUser?._id) {
      loadThread(selectedPatientUser._id);
    }
  }, [selectedPatientUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatientUser?._id) return;

    setSending(true);
    try {
      const res = await sendMessage(selectedPatientUser._id, newMessage.trim());
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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Consultation Chat</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Secure, direct consultation communication with registered patients.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Left Column: Patient List */}
        <div className="border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Connected Patients
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {patients.map((pat) => {
              const u = pat.userId;
              const isSelected = selectedPatientUser?._id === u?._id;
              return (
                <button
                  key={pat._id}
                  onClick={() => setSelectedPatientUser(u)}
                  className={`w-full p-4 text-left flex items-center gap-3 transition ${
                    isSelected ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0">
                    {u?.name ? u.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {u?.name || 'Patient'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {pat.address?.village || 'Village'} • {u?.phone || 'No phone'}
                    </p>
                  </div>
                </button>
              );
            })}

            {patients.length === 0 && (
              <p className="p-6 text-center text-xs text-slate-400">No patient contacts found.</p>
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {selectedPatientUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 font-bold">
                  {selectedPatientUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {selectedPatientUser.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {selectedPatientUser.email}
                  </span>
                </div>
              </div>

              {/* Message History */}
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
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMe ? 'text-indigo-100' : 'text-slate-400'
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
                    <p className="text-xs">No prior messages with this patient.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Send a reply to assist them.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  placeholder="Type clinical guidance or reply to patient..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-slate-400 p-8">
              Select a patient from the left to start consultation chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorMessages;
