"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { 
  Send, Paperclip, Smile, MoreVertical, 
  User, Check, CheckCheck, Loader2, X, Download,
  FileText, Image as ImageIcon, File, AlertCircle
} from "lucide-react";
import { getToken, getUser } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { Theme } from "emoji-picker-react";

interface ChatMessage {
  id: string;
  case_id: string;
  sender_id: string;
  message: string;
  status: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  files: Array<{
    id: string;
    filename: string;
    file_url: string;
  }>;
}

interface ChatBoxProps {
  caseId: string;
  currentUser: any;
}

export default function ChatBox({ caseId, currentUser }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState<{ name: string; isTyping: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Fetch History
    const fetchHistory = async () => {
      try {
        const token = getToken();
        const res = await fetch(`/api/v1/chats/${caseId}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === "success") {
          // Backend returns [oldest -> newest] for the current page
          setMessages(data.data.chats);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // 2. Initialize WebSocket
    const token = getToken();
    console.log("Initializing WebSocket connection to /chats...");
    
    const socket = io("http://localhost:3009/chats", {
      auth: { token },
      transports: ["websocket", "polling"], // Allow polling as fallback
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const joinRoom = () => {
      const cleanCaseId = caseId.trim();
      console.log("📤 Attempting to join room:", cleanCaseId);
      socket.emit("joinCaseRoom", { caseId: cleanCaseId });
    };

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected! ID:", socket.id);
      setConnectionStatus("connected");
      setErrorMessage("");
      joinRoom();
    });

    // Join room immediately if already connected or on mount
    if (socket.connected) joinRoom();

    socket.on("reconnect", () => {
      console.log("🔄 WebSocket Reconnected");
      joinRoom();
    });

    socket.on("joinCaseRoom", (data) => {
      console.log("✅ Room join confirmed by server:", data);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket Connection Error:", err.message);
      setConnectionStatus("error");
      setErrorMessage("Gagal terhubung ke server chat.");
    });

    socket.on("newMessage", (message: ChatMessage) => {
      console.log("📩 New Message Received via WebSocket:", message);
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      // Auto scroll with slight delay for DOM update
      setTimeout(scrollToBottom, 100);
    });

    socket.on("userTyping", (data: { userId: string; name: string; isTyping: boolean }) => {
      if (data.userId !== currentUser?.id) {
        setOtherTyping(data.isTyping ? { name: data.name, isTyping: true } : null);
      }
    });

    socket.on("error", (err: any) => {
      console.error("⚠️ Socket Error Event:", err);
      setErrorMessage(err.message || "Terjadi kesalahan pada koneksi chat.");
    });

    return () => {
      console.log("Cleaning up WebSocket...");
      socket.emit("leaveCaseRoom", { caseId });
      socket.disconnect();
    };
  }, [caseId, currentUser?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      caseId,
      message: inputText.trim()
    });

    setInputText("");
    // Stop typing indicator
    socketRef.current.emit("typing", { caseId, isTyping: false });
    setIsTyping(false);
  };

  const onEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject.emoji;
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = inputText;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    
    setInputText(newText);
    
    // Focus back to input and set cursor position
    setTimeout(() => {
      input.focus();
      const newPos = start + emoji.length;
      input.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (!socketRef.current) return;

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      socketRef.current.emit("typing", { caseId, isTyping: true });
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      socketRef.current.emit("typing", { caseId, isTyping: false });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = getToken();
      const res = await fetch(`/api/v1/chats/${caseId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.status === "success") {
        socketRef.current.emit("sendMessage", {
          caseId,
          message: "",
          attachments: [{
            filename: data.data.filename,
            file_url: data.data.file_url
          }]
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Gagal mengunggah file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return <ImageIcon className="w-4 h-4" />;
    if (ext === "pdf") return <FileText className="w-4 h-4 text-red-500" />;
    return <File className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Diskusi Kasus</h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected" ? "bg-green-500 animate-pulse" : 
                connectionStatus === "error" ? "bg-red-500" : "bg-yellow-500"
              }`}></span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                {connectionStatus === "connected" ? "Terhubung" : 
                 connectionStatus === "error" ? "Koneksi Bermasalah" : "Menghubungkan..."}
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scroll-smooth"
      >
        {errorMessage && (
          <div className="p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center space-y-2">
            <Smile className="w-12 h-12 opacity-20" />
            <p className="text-sm">Belum ada percakapan. Mulai diskusi sekarang.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`
                    px-4 py-2.5 rounded-2xl text-sm shadow-sm
                    ${isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"}
                  `}>
                    {msg.message}
                    
                    {msg.files && msg.files.length > 0 && (
                      <div className={`mt-2 space-y-1 ${isMe ? "text-blue-100" : "text-slate-500"}`}>
                        {msg.files.map(f => (
                          <a 
                            key={f.id}
                            href={`/api/v1${f.file_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors
                              ${isMe 
                                ? "bg-white/10 border-white/20 hover:bg-white/20" 
                                : "bg-slate-50 border-slate-100 hover:bg-slate-100"}
                            `}
                          >
                            {getFileIcon(f.filename)}
                            <span className="truncate max-w-[150px]">{f.filename}</span>
                            <Download className="w-3 h-3 ml-auto" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 px-1">
                    <span className="text-[9px] text-slate-400 font-medium">{formatTime(msg.created_at)}</span>
                    {isMe && (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        
        {otherTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] text-slate-400 font-medium italic"
          >
            <div className="flex gap-0.5">
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            {otherTyping.name} sedang mengetik...
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            className="hidden" 
          />
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onFocus={() => setShowEmojiPicker(false)}
              placeholder="Tulis pesan Anda..."
              className="w-full px-5 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`transition-colors ${showEmojiPicker ? "text-yellow-500" : "text-slate-400 hover:text-yellow-500"}`}
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            {/* Emoji Picker Overlay */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl"
                >
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    theme={Theme.LIGHT}
                    searchPlaceholder="Cari emoji..."
                    width={320}
                    height={400}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            type="submit"
            disabled={!inputText.trim() || uploading}
            className={`
              p-2.5 rounded-xl transition-all
              ${inputText.trim() 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95" 
                : "bg-slate-100 text-slate-400"}
            `}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
