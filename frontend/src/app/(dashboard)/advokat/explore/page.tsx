"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Filter, Search, MapPin, Scale, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CaseItem {
  id: string;
  title: string;
  category_name?: string;
  category?: { name: string };
  location: string;
  urgency: string;
  description: string;
  created_at: string;
}

export default function AdvokatExplorePage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState("");

  const fetchAvailableCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/cases/available");
      setCases(res.data.cases || []);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data kasus");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableCases();
  }, [fetchAvailableCases]);

  const handleAcceptCase = async (caseId: string) => {
    if (!confirm("Apakah Anda yakin ingin mengambil kasus ini? Anda akan ditugaskan sebagai Advokat untuk kasus ini.")) return;

    setAcceptingId(caseId);
    try {
      await apiFetch(`/cases/${caseId}/accept`, {
        method: "PATCH",
      });
      alert("Kasus berhasil diterima. Kasus akan masuk ke menu 'Kasus Aktif'.");
      fetchAvailableCases(); // Refresh list
    } catch (err: any) {
      alert("Gagal menerima kasus: " + err.message);
    } finally {
      setAcceptingId("");
    }
  };

  const mapUrgencyColor = (urgency: string) => {
    if (urgency === "high") return "text-red-700 bg-red-100";
    if (urgency === "medium") return "text-yellow-700 bg-yellow-100";
    return "text-blue-700 bg-blue-100";
  };

  const mapUrgencyLabel = (urgency: string) => {
    if (urgency === "high") return "Tinggi";
    if (urgency === "medium") return "Sedang";
    if (urgency === "low") return "Rendah";
    return urgency;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Telusuri Kasus Pro Bono</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar kasus dari klien kurang mampu yang telah lolos verifikasi kelengkapan SKTM.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
            placeholder="Cari kata kunci kasus, nama daerah, dll..."
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAvailableCases} disabled={loading} className="flex items-center px-4 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
             <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
             Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* List of Cases */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-sm text-slate-500">Mencari kasus tersedia...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
            <Scale className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-base font-medium text-slate-900">Belum ada kasus baru</p>
            <p className="text-sm text-slate-500 mt-1">Saat ini belum ada kasus tersedia yang membutuhkan advokat.</p>
          </div>
        ) : (
          cases.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${mapUrgencyColor(item.urgency)}`}>
                      Urgensi {mapUrgencyLabel(item.urgency)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded">
                      {item.category_name || item.category?.name || "Lainnya"}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      {new Date(item.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center text-sm text-slate-500 gap-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                      {item.location || "-"}
                    </div>
                    <div className="flex items-center uppercase">
                      <Scale className="w-4 h-4 mr-1.5 text-slate-400" />
                      ID: {item.id.substring(0,8)}...
                    </div>
                  </div>
                </div>
                
                <div className="md:w-48 shrink-0 md:text-right mt-4 md:mt-0 flex flex-col md:items-end justify-between h-full">
                  <button 
                    onClick={() => handleAcceptCase(item.id)}
                    disabled={acceptingId === item.id}
                    className="w-full md:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm mb-3 disabled:opacity-70 flex items-center justify-center">
                    {acceptingId === item.id ? <><RefreshCw className="w-4 h-4 animate-spin mr-2"/> Memproses</> : "Terima Kasus"}
                  </button>
                  <Link href={`/advokat/kasus/${item.id}`} className="w-full md:w-auto px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors text-center inline-block">
                    Detail Berkas
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
