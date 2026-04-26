"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  User, Mail, Phone, MapPin, Upload, Save, CheckCircle2,
  AlertCircle, Camera, FileText, Shield, RefreshCw, X, Eye
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  verification_status: string;
  profile_image?: string | null;
  address?: string;
  phone_number?: string;
  nik?: string;
  ktp_image?: string | null;
  client_detail?: { sktm_upload?: string | null };
  lawyer_detail?: { license_upload?: string | null };
}

interface Toast {
  msg: string;
  type: "success" | "error";
}

/** Dispatch a custom event so layout.tsx can update sidebar in real-time */
function dispatchProfileUpdate(detail: Partial<UserProfile>) {
  window.dispatchEvent(new CustomEvent("probono:profile-updated", { detail }));
}

export default function ProfileEditPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingKtp, setUploadingKtp] = useState(false);
  const [uploadingSktm, setUploadingSktm] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const ktpRef = useRef<HTMLInputElement>(null);
  const sktmRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // ── Fetch profile ──────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/me");
      const u = res.data.user as UserProfile;
      setUser(u);
      setName(u.name || "");
      setAddress(u.address || "");
      setPhoneNumber(u.phone_number || "");
    } catch (err: any) {
      showToast("Gagal memuat profil: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Save basic info ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await apiFetch(`/users/${user.id}`, {
        method: "PUT",
        body: { name, address, phone_number: phoneNumber },
      });

      // Update local state
      setUser(prev => prev ? { ...prev, name, address, phone_number: phoneNumber } : prev);

      // Sync localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name }));

      // Notify layout to update sidebar name instantly
      dispatchProfileUpdate({ name, address, phone_number: phoneNumber });

      showToast("Profil berhasil diperbarui!");
    } catch (err: any) {
      showToast("Gagal menyimpan: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── File upload ────────────────────────────────────────────────────────────
  const handleUpload = async (
    field: string,
    file: File,
    endpoint: string,
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(field, file);
      const res = await apiFetch(endpoint, { method: "POST", body: formData });

      if (field === "profile_image") {
        const newUrl = res.data.url;
        setUser(prev => prev ? { ...prev, profile_image: newUrl } : prev);
        // Sync sidebar avatar instantly
        dispatchProfileUpdate({ profile_image: newUrl });
      } else {
        await fetchProfile();
      }

      showToast("Upload berhasil!");
    } catch (err: any) {
      showToast("Gagal upload: " + err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const initials = (user?.name || "?").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const isClient = user?.role === "CLIENT";
  const isLawyer = user?.role === "LAWYER";

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola informasi pribadi dan dokumen akun Anda</p>
        </div>

        {/* Profile Photo */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Foto Profil</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
              {user?.profile_image ? (
                <img src={`/api/v1${user.profile_image}`} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-slate-100 h-full w-full flex items-center justify-center text-slate-600 text-2xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-3">Format: JPG atau PNG. Maks. 5MB.</p>
              <button
                onClick={() => photoRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {uploadingPhoto ? "Mengunggah..." : "Ganti Foto"}
              </button>
              <input
                ref={photoRef} type="file" accept="image/png,image/jpeg" className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f && user) handleUpload("profile_image", f, `/users/${user.id}/upload-profile-image`, setUploadingPhoto);
                }}
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Informasi Pribadi</h2>
          <div className="space-y-4">
            {/* Email - readonly */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                {user?.email}
              </div>
            </div>

            {/* Role & status - readonly */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role &amp; Status</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
                <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="capitalize">{user?.role?.toLowerCase()}</span>
                {user?.verification_status === "VERIFIED" && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Terverifikasi ✓</span>
                )}
                {user?.verification_status === "PENDING" && (
                  <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Menunggu Verifikasi</span>
                )}
                {user?.verification_status === "REJECTED" && (
                  <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Ditolak</span>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama lengkap Anda"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor HP</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  value={address} onChange={e => setAddress(e.target.value)} rows={3}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Alamat lengkap Anda"
                />
              </div>
            </div>

            <button
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        {/* Documents */}
        {(isClient || isLawyer) && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Dokumen</h2>
            <div className="space-y-3">
              <DocRow
                label="KTP" description="Kartu Tanda Penduduk"
                uploaded={!!user?.ktp_image} uploading={uploadingKtp}
                url={user?.ktp_image}
                color="blue" onUpload={() => ktpRef.current?.click()}
              />
              <input ref={ktpRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f && user) handleUpload("ktp_image", f, `/users/${user.id}/upload-ktp`, setUploadingKtp); }} />

              {isClient && (
                <>
                  <DocRow
                    label="SKTM" description="Surat Keterangan Tidak Mampu"
                    uploaded={!!user?.client_detail?.sktm_upload} uploading={uploadingSktm}
                    url={user?.client_detail?.sktm_upload}
                    color="orange" onUpload={() => sktmRef.current?.click()}
                  />
                  <input ref={sktmRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f && user) handleUpload("sktm_file", f, `/users/${user.id}/upload-sktm`, setUploadingSktm); }} />
                </>
              )}

              {isLawyer && (
                <>
                  <DocRow
                    label="Lisensi Advokat" description="Kartu Tanda Advokat / Sertifikat"
                    uploaded={!!user?.lawyer_detail?.license_upload} uploading={uploadingLicense}
                    url={user?.lawyer_detail?.license_upload}
                    color="purple" onUpload={() => licenseRef.current?.click()}
                  />
                  <input ref={licenseRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f && user) handleUpload("license_file", f, `/users/${user.id}/upload-license`, setUploadingLicense); }} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed bottom toast ──────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ minWidth: 280 }}
        >
          {toast.type === "success"
            ? <CheckCircle2 className="h-4 w-4 shrink-0" />
            : <AlertCircle className="h-4 w-4 shrink-0" />
          }
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-80 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}

function DocRow({ label, description, uploaded, uploading, url, color, onUpload }: {
  label: string; description: string; uploaded: boolean;
  uploading: boolean; url?: string | null; color: "blue" | "orange" | "purple"; onUpload: () => void;
}) {
  const colorMap = { blue: "bg-blue-100 text-blue-600", orange: "bg-orange-100 text-orange-600", purple: "bg-purple-100 text-purple-600" };
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
          <p className={`text-xs mt-0.5 font-medium ${uploaded ? "text-green-600" : "text-slate-400"}`}>
            {uploaded ? "✓ Sudah diupload" : "Belum diupload"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {uploaded && url && (
          <a
            href={`/api/v1${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
          >
            <Eye className="h-3 w-3" />
            Lihat
          </a>
        )}
        <button onClick={onUpload} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          {uploading ? "Uploading..." : uploaded ? "Ganti" : "Upload"}
        </button>
      </div>
    </div>
  );
}
