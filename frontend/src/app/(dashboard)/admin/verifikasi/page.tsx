"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, File, Shield, User, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  nik?: string;
  province?: string;
  city?: string;
  verification_status: string;
  created_at?: string;
  ktp_image?: string;
  client?: {
    sktm_upload?: string;
  };
  lawyer?: {
    organization_name?: string;
    license_number?: string;
    experience?: string;
    license_upload?: string;
  };
}

export default function VerifikasiPage() {
  const [activeTab, setActiveTab] = useState<"klien" | "advokat">("klien");
  const [clients, setClients] = useState<PendingUser[]>([]);
  const [lawyers, setLawyers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [clientRes, lawyerRes] = await Promise.all([
        apiFetch("/users?role=CLIENT&verification_status=PENDING&limit=50"),
        apiFetch("/users?role=LAWYER&verification_status=PENDING&limit=50"),
      ]);
      setClients(clientRes.data.users ?? []);
      setLawyers(lawyerRes.data.users ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handlePreview = (url?: string | null) => {
    if (!url) {
      alert("Dokumen belum diunggah.");
      return;
    }
    // URL from DB is usually like "/uploads/filename.ext". API proxy maps "/api/v1"
    window.open(`/api/v1${url}`, "_blank");
  };

  const handleVerify = async (userId: string, status: "VERIFIED" | "REJECTED") => {
    setActionLoading(userId);
    try {
      await apiFetch(`/users/${userId}/verify`, {
        method: "PATCH",
        body: {
          status,
          is_active: status === "VERIFIED",
          rejection_reason: status === "REJECTED" ? "Dokumen tidak memenuhi syarat" : "",
        },
      });
      await fetchPending(); // refresh list
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingClients = clients.length;
  const pendingLawyers = lawyers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verifikasi Berkas Pengguna</h1>
          <p className="mt-1 text-sm text-slate-500">
            Proses validasi kelayakan Klien (SKTM & KTP) dan keaslian lisensi Advokat.
          </p>
        </div>
        <button onClick={fetchPending} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex">
            <button onClick={() => setActiveTab("klien")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "klien" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}>
              Antrean Verifikasi Klien
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs">
                {loading ? "..." : pendingClients}
              </span>
            </button>
            <button onClick={() => setActiveTab("advokat")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "advokat" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}>
              Antrean Verifikasi Advokat
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs">
                {loading ? "..." : pendingLawyers}
              </span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div>
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-400" />
              <p className="text-sm">Memuat data...</p>
            </div>
          ) : activeTab === "klien" ? (
            <>
              {clients.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Check className="h-10 w-10 mx-auto mb-3 text-green-400" />
                  <p className="font-medium">Tidak ada klien yang menunggu verifikasi</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {clients.map((c) => (
                    <li key={c.id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                              <User className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">{c.name}</h3>
                              <div className="flex items-center text-xs text-slate-500 gap-3">
                                <span>NIK: {c.nik ?? "-"}</span>
                                {c.province && <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{c.province}, {c.city}</span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{c.email}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-3">
                            <div 
                              onClick={() => handlePreview(c.ktp_image)}
                              className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <File className="h-7 w-7 text-slate-400 mr-2" />
                              <div>
                                <p className="text-xs font-semibold text-slate-700">Foto KTP</p>
                                <span className="text-[10px] text-blue-600 font-medium">Preview Dokumen</span>
                              </div>
                            </div>
                            <div 
                              onClick={() => handlePreview(c.client?.sktm_upload)}
                              className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <File className="h-7 w-7 text-slate-400 mr-2" />
                              <div>
                                <p className="text-xs font-semibold text-slate-700">Surat SKTM</p>
                                <span className="text-[10px] text-blue-600 font-medium">Preview Dokumen</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-row md:flex-col gap-2 justify-end pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 md:w-44">
                          <button
                            onClick={() => handleVerify(c.id, "VERIFIED")}
                            disabled={actionLoading === c.id}
                            className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
                            {actionLoading === c.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" /> Approve</>}
                          </button>
                          <button
                            onClick={() => handleVerify(c.id, "REJECTED")}
                            disabled={actionLoading === c.id}
                            className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 text-sm font-medium rounded-md transition-colors">
                            <X className="h-4 w-4 mr-2" /> Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              {lawyers.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Check className="h-10 w-10 mx-auto mb-3 text-green-400" />
                  <p className="font-medium">Tidak ada advokat yang menunggu verifikasi</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {lawyers.map((a) => (
                    <li key={a.id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                              <Shield className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">{a.name}</h3>
                              <div className="flex items-center text-xs text-slate-500 gap-3">
                                {a.lawyer?.organization_name && <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{a.lawyer.organization_name}</span>}
                                {a.lawyer?.license_number && <span>NIA: {a.lawyer.license_number}</span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{a.email}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-3">
                            <div 
                              onClick={() => handlePreview(a.ktp_image)}
                              className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <File className="h-7 w-7 text-slate-400 mr-2" />
                              <div>
                                <p className="text-xs font-semibold text-slate-700">Foto KTP</p>
                                <span className="text-[10px] text-blue-600 font-medium">Preview Dokumen</span>
                              </div>
                            </div>
                            <div 
                              onClick={() => handlePreview(a.lawyer?.license_upload)}
                              className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <File className="h-7 w-7 text-slate-400 mr-2" />
                              <div>
                                <p className="text-xs font-semibold text-slate-700">Lisensi Advokat</p>
                                <span className="text-[10px] text-blue-600 font-medium">Preview Dokumen</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-row md:flex-col gap-2 justify-end pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 md:w-44">
                          <button
                            onClick={() => handleVerify(a.id, "VERIFIED")}
                            disabled={actionLoading === a.id}
                            className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
                            {actionLoading === a.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" /> Approve</>}
                          </button>
                          <button
                            onClick={() => handleVerify(a.id, "REJECTED")}
                            disabled={actionLoading === a.id}
                            className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 text-sm font-medium rounded-md transition-colors">
                            <X className="h-4 w-4 mr-2" /> Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
