"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Scale, Clock, FileText, ChevronRight, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CaseItem {
  id: string;
  title: string;
  category_name?: string;
  category?: { name: string };
  status: string;
  created_at: string;
  lawyer?: { name: string };
}

export default function RiwayatKasusPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/cases/me");
      setCases(res.data.cases || []);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data kasus");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "Menunggu Advokat";
      case "ACCEPTED": return "Diterima";
      case "IN_PROGRESS": return "Sedang Berjalan";
      case "CLOSED": return "Kasus Selesai";
      case "REJECTED": return "Ditolak";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-blue-100 text-blue-800";
      case "ACCEPTED": return "bg-indigo-100 text-indigo-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "CLOSED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Kasus</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar semua kasus hukum yang pernah Anda ajukan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCases} disabled={loading}
            className="flex items-center px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm rounded-md text-sm font-medium disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link href="/client/kasus/baru" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
            Ajukan Kasus
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-sm text-slate-500">Memuat data kasus...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-base font-medium text-slate-900">Belum ada pengajuan kasus</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">Anda belum memiliki riwayat pengajuan bantuan hukum Pro Bono.</p>
            <Link href="/client/kasus/baru" className="text-sm font-medium text-blue-600 hover:underline">
              Ajukan kasus pertama Anda
            </Link>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-200">
            {cases.map((item) => (
              <li key={item.id} className="hover:bg-slate-50 transition-colors block">
                <Link href={`/client/kasus/${item.id}`} className="block px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-semibold text-blue-600 truncate uppercase">
                        {item.id.substring(0, 13)}...
                      </p>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <div className="flex flex-shrink-0 ml-2">
                      <p className="text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0 sm:ml-6">
                        <Scale className="mr-1.5 h-4 w-4 shrink-0 text-slate-400" />
                        {item.category_name || item.category?.name || "-"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                      <Clock className="mr-1.5 h-4 w-4 shrink-0 text-slate-400" />
                      <p>Advokat: <span className="font-medium text-slate-700">{item.lawyer?.name || "-"}</span></p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
