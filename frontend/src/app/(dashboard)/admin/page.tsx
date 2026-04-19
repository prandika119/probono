import Link from "next/link";
import { Users, FileText, CheckCircle, Clock, AlertTriangle, ChevronRight, Shield, Award } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin Utama</h1>
        <p className="mt-1 text-sm text-slate-500">
          Supervisi platform Pro Bono. Pantau aktivitas, verifikasi pengguna, dan moderasi kasus.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Total Klien Aktif</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">1,240</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Advokat Terverifikasi</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">345</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Verifikasi Tertunda</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">28</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Total Kasus Masuk</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">892</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tugas Mengantri (Action Needed) */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Tugas Prioritas</h2>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              Perlu Tindakan
            </span>
          </div>
          <div className="flex-1 space-y-4">
            <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-900">Verifikasi Dokumen Klien</span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">12 Antrean</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">12 Klien mengunggah SKTM baru untuk dinilai kelayakannya.</p>
              <div className="mt-3">
                <Link href="/admin/verifikasi" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center">
                  Review Sekarang <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-900">Verifikasi Lisensi Advokat</span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">5 Antrean</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">5 Advokat baru mendaftar dan membutuhkan otorisasi KTA/PERADI.</p>
              <div className="mt-3">
                <Link href="/admin/verifikasi" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center">
                  Review Sekarang <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-900">Moderasi Kasus Baru</span>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">11 Antrean</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Kasus baru yang perlu direview sebelum diteruskan ke dashboard Rekomendasi Advokat.</p>
              <div className="mt-3">
                <Link href="/admin/kasus" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center">
                  Review Kasus <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcut Management */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Sistem Kontrol</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/verifikasi" className="bg-slate-50 hover:bg-slate-100 p-4 rounded-lg border border-slate-200 transition">
                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-900 text-sm">Verifikasi Pengguna</h3>
                <p className="text-xs text-slate-500 mt-1">Approve/Reject pendaftaran.</p>
              </Link>
              <Link href="/admin/kasus" className="bg-slate-50 hover:bg-slate-100 p-4 rounded-lg border border-slate-200 transition">
                <FileText className="w-6 h-6 text-green-600 mb-2" />
                <h3 className="font-semibold text-slate-900 text-sm">Review Kasus</h3>
                <p className="text-xs text-slate-500 mt-1">Saring kasus tidak valid.</p>
              </Link>
              <button disabled className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 opacity-70 cursor-not-allowed text-left">
                <Users className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-semibold text-slate-900 text-sm">Manajemen Role</h3>
                <p className="text-xs text-slate-500 mt-1">Ban/Suspend akun (Soon)</p>
              </button>
              <button disabled className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 opacity-70 cursor-not-allowed text-left">
                <FileText className="w-6 h-6 text-yellow-500 mb-2" />
                <h3 className="font-semibold text-slate-900 text-sm">Artikel Edukasi</h3>
                <p className="text-xs text-slate-500 mt-1">Kelola konten hukum (Soon)</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
