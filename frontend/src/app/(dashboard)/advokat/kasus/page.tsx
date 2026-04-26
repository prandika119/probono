"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Scale, Clock, AlertCircle, FileText, MessageSquare, Briefcase, Paperclip, RefreshCw, User } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface HandledCase {
  id: string;
  title: string;
  client_name?: string;
  client?: { name: string };
  category_name?: string;
  category?: { name: string };
  status: string;
  last_update?: string;
  created_at: string;
}

export default function AdvokatKasusPage() {
  const [activeTab, setActiveTab] = useState("aktif");
  const [cases, setCases] = useState<HandledCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Progress update state per case
  const [progressNote, setProgressNote] = useState<Record<string, string>>({});
  const [progressStatus, setProgressStatus] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState("");

  const fetchHandledCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/cases/handled");
      setCases(res.data.cases || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data kasus");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHandledCases();
  }, [fetchHandledCases]);

  const handleSaveProgress = async (caseId: string) => {
    const note = progressNote[caseId] || "";
    const status = progressStatus[caseId] || "IN_PROGRESS";
    if (!note.trim()) {
      alert("Harap isi catatan perkembangan kasus.");
      return;
    }
    setSavingId(caseId);
    try {
      await apiFetch(`/cases/${caseId}/progress`, {
        method: "POST",
        body: { status, note },
      });
      alert("Progress kasus berhasil diperbarui!");
      setProgressNote((prev) => ({ ...prev, [caseId]: "" }));
      fetchHandledCases();
    } catch (err: any) {
      alert("Gagal menyimpan progress: " + err.message);
    } finally {
      setSavingId("");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "Baru Masuk";
      case "ACCEPTED": return "Diterima";
      case "IN_PROGRESS": return "Sedang Berjalan";
      case "CLOSED": return "Selesai";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-indigo-100 text-indigo-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "CLOSED": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const filteredCases = cases.filter((c) =>
    activeTab === "aktif" ? c.status !== "CLOSED" : c.status === "CLOSED"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Kasus</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola kasus-kasus yang sedang Anda tangani.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchHandledCases} disabled={loading}
            className="flex items-center px-3 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("aktif")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "aktif" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Kasus Aktif
            </button>
            <button
              onClick={() => setActiveTab("selesai")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "selesai" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Selesai
            </button>
          </div>
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
            <p className="text-sm text-slate-500">Memuat kasus yang ditangani...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="font-medium text-slate-700">Tidak ada kasus di kategori ini.</p>
            <p className="text-sm mt-1">
              {activeTab === "aktif"
                ? "Anda belum mengambil kasus apapun. Cari kasus di menu Telusuri Kasus."
                : "Belum ada kasus yang telah diselesaikan."}
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-200">
            {filteredCases.map((item) => (
              <li key={item.id} className="p-5 sm:px-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <p className="text-xs font-bold text-blue-600 shrink-0 uppercase">{item.id.substring(0, 8)}...</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(item.last_update || item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>

                    <h3 className="text-lg font-medium text-slate-900 mb-1">{item.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3">
                      <div className="flex items-center">
                        <Scale className="w-4 h-4 mr-1.5 text-slate-400" />
                        {item.category_name || item.category?.name || "-"}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5 text-slate-400" />
                        Klien: {item.client_name || item.client?.name || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end md:justify-start gap-2 shrink-0 md:w-32 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                    <Link href={`/advokat/kasus/${item.id}`}
                      className="flex-1 md:flex-none flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium rounded-md transition-colors">
                      <FileText className="w-4 h-4 mr-1.5" />
                      Detail
                    </Link>
                    <button className="flex-1 md:flex-none flex items-center justify-center px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Chat
                    </button>
                  </div>
                </div>

                {/* Progress update form for active cases */}
                {item.status !== "closed" && (
                  <div className="mt-5 bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Progress Kasus</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <select
                          value={progressStatus[item.id] || "IN_PROGRESS"}
                          onChange={(e) => setProgressStatus((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          className="block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-3 bg-white"
                        >
                          <option value="IN_PROGRESS">In Progress (Sedang Berjalan)</option>
                          <option value="CLOSED">Closed (Selesai)</option>
                        </select>
                        <textarea
                          rows={2}
                          value={progressNote[item.id] || ""}
                          onChange={(e) => setProgressNote((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          className="block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-3 bg-white"
                          placeholder="Tambahkan catatan perkembangan kasus..."
                        />
                      </div>
                      <div className="shrink-0 md:w-48 space-y-2">
                        <button className="w-full flex items-center justify-center px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
                          <Paperclip className="w-4 h-4 mr-1.5" />
                          Upload Dokumen
                        </button>
                        <button
                          onClick={() => handleSaveProgress(item.id)}
                          disabled={savingId === item.id}
                          className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium rounded-md transition-colors disabled:opacity-70"
                        >
                          {savingId === item.id ? (
                            <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Menyimpan...</>
                          ) : "Simpan Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


