"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, ArrowLeft, Plus, RefreshCw, LogIn } from "lucide-react";
import { apiFetch, getToken } from "@/lib/api";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  created_at: string;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  _count?: { messages: number };
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"list" | "chat">("list");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check auth on open and periodically
    const checkAuth = () => {
      setIsAuthenticated(!!getToken());
    };
    checkAuth();
    if (isOpen) {
      const interval = setInterval(checkAuth, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadSessions();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (activeSessionId && isAuthenticated) {
      loadMessages(activeSessionId);
    } else if (!activeSessionId) {
      setMessages([]);
      setView("list");
    }
  }, [activeSessionId, isAuthenticated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, view]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/chatbot/sessions");
      setSessions(res.data.sessions || []);
    } catch (err: any) {
      console.error("Error loading sessions:", err);
      setError("Gagal memuat riwayat chat.");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const res = await apiFetch(`/chatbot/sessions/${sessionId}/messages`);
      setMessages(res.data.messages || []);
      setView("chat");
    } catch (err: any) {
      console.error("Error loading messages:", err);
      setError("Gagal memuat pesan.");
      setView("list");
      setActiveSessionId(null);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSessionId || isTyping) return;

    const question = inputValue;
    setInputValue("");
    
    // Optimistic update
    const tempId = Date.now().toString();
    const userMsg: Message = {
      id: tempId,
      content: question,
      role: "user",
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      const res = await apiFetch(`/chatbot/sessions/${activeSessionId}/ask`, {
        method: "POST",
        body: { question }
      });
      
      const aiMsg: Message = {
        id: Date.now().toString(),
        content: res.data.answer,
        role: "ai",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Update session list order
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, updated_at: new Date().toISOString(), _count: { messages: (s._count?.messages || 0) + 2 } } : s
      ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));

    } catch (err: any) {
      setError("Gagal mengirim pesan. Silakan coba lagi.");
      // Remove optimistic message if it failed? Or keep it with error icon?
      // For simplicity, just show error toast
    } finally {
      setIsTyping(false);
    }
  };

  const createNewSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/chatbot/sessions", {
        method: "POST",
        body: { title: "Chat Baru" }
      });
      const newSession = res.data.session;
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newSession.id);
      setMessages([]);
      setView("chat");
    } catch (err: any) {
      setError("Gagal membuat sesi baru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-0 w-[350px] sm:w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {view === "chat" && (
                    <button 
                      onClick={() => {
                        setView("list");
                        setActiveSessionId(null);
                      }} 
                      className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Asisten Hukum</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">AI Powered</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isAuthenticated && view === "list" && (
                    <button onClick={createNewSession} className="hover:bg-white/20 p-2 rounded-xl transition-colors" title="Chat Baru">
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {!isAuthenticated ? (
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                    <LogIn className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Akses Terbatas</h4>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Masuk ke akun Anda untuk mulai berdiskusi dengan Asisten AI kami dan menyimpan riwayat konsultasi hukum Anda.
                  </p>
                  <Link 
                    href="/auth/login" 
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                    onClick={() => setIsOpen(false)}
                  >
                    Login ke ProbNect
                  </Link>
                  <p className="mt-4 text-xs text-slate-400">
                    Belum punya akun? <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">Daftar sekarang</Link>
                  </p>
               </div>
            ) : view === "list" ? (
              /* Session List View */
              <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
                <div className="flex items-center justify-between p-5 pb-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Riwayat Konsultasi</h4>
                  {loading && <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex flex-col gap-2 mb-2">
                      <p className="font-medium">{error}</p>
                      <button 
                        onClick={loadSessions}
                        className="text-[10px] font-bold uppercase tracking-wider text-red-700 hover:underline text-left"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  )}

                  {sessions.length === 0 && !loading && !error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-slate-100 text-slate-300">
                        <MessageCircle className="w-8 h-8" />
                      </div>
                      <h5 className="font-bold text-slate-800 mb-1">Mulai Konsultasi</h5>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Anda belum memiliki riwayat chat. Tanyakan apa saja tentang hukum di Indonesia.
                      </p>
                      <button 
                        onClick={createNewSession}
                        className="bg-white border border-blue-200 text-blue-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                      >
                        Buat Sesi Baru
                      </button>
                    </div>
                  ) : (
                    sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSessionId(s.id);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1 group ${
                          s.id === activeSessionId 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                            : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md text-slate-900"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <p className={`font-bold text-sm truncate ${s.id === activeSessionId ? "text-white" : "text-slate-900"}`}>
                            {s.title}
                          </p>
                          <span className={`text-[10px] whitespace-nowrap ml-2 font-medium ${s.id === activeSessionId ? "text-blue-100" : "text-slate-400"}`}>
                            {new Date(s.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs truncate max-w-[80%] ${s.id === activeSessionId ? "text-blue-50" : "text-slate-500"}`}>
                            {s._count?.messages ? `${s._count.messages} Pesan` : "Belum ada pesan"}
                          </p>
                          <Send className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${s.id === activeSessionId ? "text-white" : "text-blue-500"}`} />
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                  <button 
                    onClick={createNewSession}
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    Konsultasi Baru
                  </button>
                </div>
              </div>
            ) : (
              /* Chat View */
              <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 scroll-smooth">
                  {loadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-widest">Sinkronisasi...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
                       <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner relative">
                          <Bot className="w-10 h-10" />
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 text-lg mb-2">Halo! Ada yang bisa dibantu?</h4>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-[250px] mx-auto">
                             Saya siap membantu menjawab pertanyaan hukum Anda berdasarkan dokumen hukum yang tersedia.
                          </p>
                       </div>
                       <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
                          <button 
                            onClick={() => setInputValue("Bagaimana cara mengajukan bantuan hukum?")}
                            className="text-left p-3 rounded-xl bg-white border border-slate-100 text-xs text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                          >
                            "Bagaimana cara mengajukan bantuan hukum?"
                          </button>
                          <button 
                            onClick={() => setInputValue("Apa saja syarat pendaftaran advokat?")}
                            className="text-left p-3 rounded-xl bg-white border border-slate-100 text-xs text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                          >
                            "Apa saja syarat pendaftaran advokat?"
                          </button>
                       </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex ${msg.role === 'ai' ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[85%] flex gap-3 ${msg.role === 'ai' ? "flex-row" : "flex-row-reverse"}`}>
                          <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm mt-1 ${
                            msg.role === 'ai' ? "bg-blue-100 text-blue-600" : "bg-slate-800 text-white"
                          }`}>
                            {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                            msg.role === 'ai' 
                              ? "bg-white text-slate-700 rounded-tl-none border border-slate-100" 
                              : "bg-blue-600 text-white rounded-tr-none"
                          }`}>
                            {msg.content}
                            <div className={`text-[9px] mt-2 font-medium ${msg.role === 'ai' ? "text-slate-400" : "text-blue-100 text-right"}`}>
                              {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                           <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                           <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                           <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="px-4">
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-2 p-3 bg-red-50 text-[11px] text-red-600 border border-red-100 rounded-xl flex items-center justify-between"
                      >
                        <span className="font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-end">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all flex flex-col p-1">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e as any);
                        }
                      }}
                      placeholder="Tulis pertanyaan Anda..."
                      disabled={!activeSessionId || isTyping}
                      className="bg-transparent border-none px-3 py-2 text-[13px] focus:outline-none text-slate-900 disabled:opacity-50 resize-none min-h-[40px] max-h-[120px]"
                      rows={1}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || !activeSessionId || isTyping}
                    className="bg-blue-600 text-white w-[46px] h-[46px] rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-90 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none mb-1 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="chat-toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white w-16 h-16 rounded-[24px] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)] transition-all duration-300 relative group"
          >
            <MessageCircle className="w-8 h-8" />
            
            <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-xl">
              Tanya Asisten AI
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
            
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
