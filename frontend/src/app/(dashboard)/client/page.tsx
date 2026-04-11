import Link from "next/link";
import { Scale, FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Klien</h1>
        <p className="mt-1 text-sm text-slate-500">
          Selamat datang kembali! Pantau status kasus Anda di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stat Cards */}
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Total Kasus</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">2</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Kasus Diproses</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">1</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Kasus Selesai</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">1</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* CTA: Ajukan Kasus Baru */}
      <div className="bg-blue-600 rounded-xl shadow-sm text-white p-6 relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-xl font-bold mb-2">Butuh Bantuan Hukum Baru?</h2>
          <p className="text-blue-100 mb-4 text-sm">
            Ajukan kasus pro bono Anda sekarang. Tim kami siap melakukan review dan menghubungkan Anda dengan advokat yang tepat.
          </p>
          <Link href="/client/kasus/baru" className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-slate-50 transition-colors text-sm">
            Ajukan Kasus <Scale className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="hidden md:block opacity-20 relative z-10">
          <Scale className="h-32 w-32" />
        </div>
        <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      </div>

      {/* Recent Cases */}
      <div>
        <h2 className="text-lg font-medium leading-6 text-slate-900 mb-4">Kasus Terbaru</h2>
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
          <ul role="list" className="divide-y divide-slate-200">
            <li className="hover:bg-slate-50 transition-colors cursor-pointer block">
              <Link href="/client/kasus/PRB-2026-01" className="block p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
                      <Scale className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600 truncate">PRB-2026-01: Sengketa Tanah Waris</p>
                      <p className="text-xs text-slate-500 mt-1">Diajukan: 12 Okt 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      In Progress
                    </span>
                    <ArrowRight className="ml-4 h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            </li>
            <li className="hover:bg-slate-50 transition-colors cursor-pointer block">
              <Link href="/client/kasus/PRB-2026-02" className="block p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900 truncate">PRB-2026-02: PHK Sepihak</p>
                      <p className="text-xs text-slate-500 mt-1">Selesai: 05 Sep 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Selesai
                    </span>
                    <ArrowRight className="ml-4 h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            </li>
          </ul>
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-center">
            <Link href="/client/kasus" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Lihat semua riwayat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
