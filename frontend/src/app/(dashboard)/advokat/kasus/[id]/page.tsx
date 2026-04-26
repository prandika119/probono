"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Scale, MapPin, User, Clock, FileText,
  AlertTriangle, CheckCircle2, RefreshCw, AlertCircle,
  Paperclip, X
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CaseProgress {
  id: string;
  status: string;
  note: string;
  created_at: string;
}

interface CaseDocument {
  id: string;
  filename: string;
  file_url: string;
}

interface CaseDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  date?: string;
  opponent?: string;
  estimated_loss?: number;
  legal_goal: string;
  urgency: string;
  status: string;
  created_at: string;
  client?: { id: string; name: string; phone_number?: string };
  lawyer?: { id: string; name: string; organization_name?: string };
  category?: { name: string };
  documents: CaseDocument[];
  progress: CaseProgress[];
}

const statusLabel: Record<string, string> = {
  SUBMITTED: "Menunggu Advokat",
  ACCEPTED: "Diterima Advokat",
  IN_PROGRESS: "Sedang Berjalan",
  CLOSED: "Selesai",
};
const statusColor: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-indigo-100 text-indigo-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-green-100 text-green-800",
};
const urgencyLabel: Record<string, string> = { HIGH: "Tinggi", MEDIUM: "Sedang", LOW: "Rendah" };
const urgencyColor: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-blue-100 text-blue-700",
};

export default function AdvokatCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Progress update
  const [progressStatus, setProgressStatus] = useState("IN_PROGRESS");
  const [progressNote, setProgressNote] = useState("");
  const [savingProgress, setSavingProgress] = useState(false);

  // Upload consultation
  const [consultTitle, setConsultTitle] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultNotes, setConsultNotes] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [consultLink, setConsultLink] = useState("");
  const [consultLocation, setConsultLocation] = useState("");
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [savingConsult, setSavingConsult] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const fetchCase = () => {
    if (!id) return;
    setLoading(true);
    apiFetch(`/cases/${id}`)
      .then((res) => setCaseData(res.data.case))
      .catch((err) => setError(err.message || "Gagal memuat detail kasus"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleAcceptCase = async () => {
    if (!confirm("Apakah Anda yakin ingin menangani kasus ini?")) return;
    setAccepting(true);
    try {
      await apiFetch(`/cases/${id}/accept`, { method: "POST" });
      alert("Kasus berhasil Anda ambil!");
      fetchCase();
    } catch (err: any) {
      alert("Gagal mengambil kasus: " + err.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressNote.trim()) { alert("Isi catatan progress terlebih dahulu."); return; }
    setSavingProgress(true);
    try {
      await apiFetch(`/cases/${id}/progress`, {
        method: "POST",
        body: { status: progressStatus, note: progressNote },
      });
      alert("Progress berhasil diperbarui!");
      setProgressNote("");
      fetchCase();
    } catch (err: any) {
      alert("Gagal menyimpan progress: " + err.message);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConsult(true);
    try {
      await apiFetch(`/cases/${id}/consultations`, {
        method: "POST",
        body: {
          title: consultTitle,
          consultation_at: new Date(consultDate).toISOString(),
          is_online: isOnline,
          link_meet: isOnline ? consultLink : undefined,
          location: !isOnline ? consultLocation : undefined,
          notes: consultNotes,
        },
      });
      alert("Jadwal konsultasi berhasil ditambahkan!");
      setShowConsultModal(false);
      setConsultTitle(""); setConsultDate(""); setConsultNotes(""); setConsultLink(""); setConsultLocation("");
    } catch (err: any) {
      alert("Gagal membuat konsultasi: " + err.message);
    } finally {
      setSavingConsult(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
      <p className="text-sm text-slate-500">Memuat detail kasus...</p>
    </div>
  );

  if (error || !caseData) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
      <p className="text-sm text-red-700">{error || "Kasus tidak ditemukan"}</p>
    </div>
  );

  const c = caseData;
  const isClosed = c.status === "CLOSED";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-blue-600 transition-colors mt-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">{c.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[c.status] || "bg-slate-100 text-slate-700"}`}>
              {statusLabel[c.status] || c.status}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgencyColor[c.urgency] || "bg-slate-100"}`}>
              <AlertTriangle className="w-3 h-3 mr-1" /> Urgensi {urgencyLabel[c.urgency] || c.urgency}
            </span>
          </div>
        </div>
        {!isClosed && c.lawyer && (
          <button onClick={() => setShowConsultModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0">
            <Clock className="w-4 h-4" /> Buat Konsultasi
          </button>
        )}
        {!isClosed && !c.lawyer && (
          <button onClick={handleAcceptCase} disabled={accepting}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors shadow-md shrink-0 disabled:opacity-70">
            {accepting ? <RefreshCw className="w-4 h-4 animate-spin mr-1" /> : <Scale className="w-4 h-4 mr-1" />}
            Ambil Kasus Ini
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Deskripsi */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Deskripsi Kasus</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.description}</p>
          </div>

          {/* Update Progress Form */}
          {!isClosed && c.lawyer && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Update Progress</h2>
              <form onSubmit={handleSaveProgress} className="space-y-3">
                <select value={progressStatus} onChange={(e) => setProgressStatus(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="IN_PROGRESS">In Progress (Sedang Berjalan)</option>
                  <option value="CLOSED">Closed (Selesai)</option>
                </select>
                <textarea value={progressNote} onChange={(e) => setProgressNote(e.target.value)} rows={3}
                  placeholder="Catatan perkembangan kasus..."
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                <button type="submit" disabled={savingProgress}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-70 transition-colors">
                  {savingProgress ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Menyimpan...</> : "Simpan Update"}
                </button>
              </form>
            </div>
          )}

          {/* Timeline Progress */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Riwayat Progress</h2>
            {c.progress.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Belum ada riwayat progress.</p>
            ) : (
              <ol className="relative border-l border-slate-200 space-y-5 ml-2">
                {[...c.progress].reverse().map((p) => (
                  <li key={p.id} className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500"></div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[p.status] || "bg-slate-100 text-slate-600"}`}>
                        {statusLabel[p.status] || p.status}
                      </span>
                      <time className="text-xs text-slate-400">
                        {new Date(p.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </div>
                    <p className="text-sm text-slate-700">{p.note}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Dokumen */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Dokumen Pendukung</h2>
            {c.documents.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Belum ada dokumen yang diunggah.</p>
            ) : (
              <ul className="space-y-2">
                {c.documents.map((doc) => (
                  <li key={doc.id}>
                    <a href={`/api/v1${doc.file_url}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <FileText className="w-4 h-4 shrink-0" />
                      {doc.filename || doc.file_url.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Info Kasus</h2>
            <InfoRow icon={<Scale className="w-4 h-4" />} label="Kategori" value={c.category?.name || "-"} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Lokasi" value={c.location || "-"} />
            {c.opponent && <InfoRow icon={<User className="w-4 h-4" />} label="Pihak Lawan" value={c.opponent} />}
            {c.estimated_loss && <InfoRow icon={<AlertTriangle className="w-4 h-4" />} label="Est. Kerugian" value={`Rp ${c.estimated_loss.toLocaleString("id-ID")}`} />}
            <InfoRow icon={<CheckCircle2 className="w-4 h-4" />} label="Tujuan Hukum" value={c.legal_goal} />
          </div>

          {/* Data Klien */}
          {c.client && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Data Klien</h2>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.client.name}</p>
                  {c.client.phone_number && <p className="text-xs text-slate-500">{c.client.phone_number}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Buat Jadwal Konsultasi</h2>
              <button onClick={() => setShowConsultModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitConsultation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul Konsultasi</label>
                <input type="text" value={consultTitle} onChange={(e) => setConsultTitle(e.target.value)} required
                  placeholder="Konsultasi Persiapan Sidang"
                  className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Waktu Konsultasi</label>
                <input type="datetime-local" value={consultDate} onChange={(e) => setConsultDate(e.target.value)} required
                  className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                  <span className="text-sm text-slate-700">Online (via video call)</span>
                </label>
              </div>
              {isOnline ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Link Meeting (Opsional)</label>
                  <input type="url" value={consultLink} onChange={(e) => setConsultLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Lokasi Pertemuan</label>
                  <input type="text" value={consultLocation} onChange={(e) => setConsultLocation(e.target.value)}
                    placeholder="Kantor LBH Jakarta Pusat"
                    className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan</label>
                <textarea value={consultNotes} onChange={(e) => setConsultNotes(e.target.value)} rows={3}
                  placeholder="Persiapkan dokumen sertifikat tanah..."
                  className="block w-full px-4 py-2.5 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowConsultModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50">
                  Batal
                </button>
                <button type="submit" disabled={savingConsult}
                  className="flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70">
                  {savingConsult ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Menyimpan...</> : "Simpan Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-slate-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
