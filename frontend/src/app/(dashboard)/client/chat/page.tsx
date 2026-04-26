"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, MessageSquare, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CaseInbox {
  id: string;
  title: string;
  lawyer?: { name: string };
  status: string;
}

export default function ClientChatPage() {
  const [cases, setCases] = useState<CaseInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/cases/me")
      .then((res) => {
        setCases(res.data.cases || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Diskusi & Pesan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola percakapan Anda dengan advokat pendamping.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-slate-300">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-sm text-slate-500">Memuat percakapan...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 text-center p-6">
          <MessageSquare className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-slate-900 font-semibold">Belum ada diskusi</h3>
          <p className="text-sm text-slate-500 max-w-xs mt-1">
            Ajukan kasus terlebih dahulu untuk mulai berdiskusi dengan advokat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cases.map((c) => (
            <Link 
              key={c.id}
              href={`/client/kasus/${c.id}?tab=chat`}
              className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {c.lawyer?.name || "Menunggu Advokat"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kasus: <span className="font-medium text-slate-700">{c.title}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600">
                  {c.status}
                </span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
