import Link from "next/link";
import { Scale, CheckCircle, Clock, Star, Users, MapPin, ChevronRight } from "lucide-react";

export default function AdvokatDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Advokat</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ikhtisar aktivitas dan kasus pro bono Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Total Kasus</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">12</span>
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
                <dt className="text-sm font-medium text-slate-500 truncate">Kasus Aktif</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">3</span>
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
                <dt className="text-sm font-medium text-slate-500 truncate">Selesai Berhasil</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">9</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Rating Klien</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-semibold text-slate-900">4.8</span>
                  <span className="text-sm text-slate-500 ml-2">/ 5.0</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner Eksplor Kasus */}
        <div className="bg-blue-900 rounded-xl shadow-sm text-white p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[240px]">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2 text-blue-50">Mari Bantu Lebih Banyak Pihak</h2>
            <p className="text-blue-200 mb-6 text-sm max-w-[80%] leading-relaxed">
              Terdapat puluhan klien yang telah diverifikasi dan sangat menantikan bantuan hukum Anda.
            </p>
            <Link href="/advokat/explore" className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-md transition-colors text-sm border border-blue-400 shadow-sm">
              Telusuri Kasus Pro Bono <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 -mr-4 -mb-4">
            <Users className="h-40 w-40" />
          </div>
        </div>

        {/* Jadwal Konsultasi Terdekat */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-slate-400" />
            Jadwal Terdekat
          </h2>
          <div className="space-y-4">
            <div className="flex p-4 border border-blue-100 bg-blue-50/50 rounded-lg">
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-white rounded shadow-sm border border-slate-100 text-blue-700">
                <span className="text-xs font-bold uppercase">Okt</span>
                <span className="text-lg font-bold">14</span>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-semibold text-slate-900">Konsultasi: Sengketa Tanah Waris</h4>
                <div className="mt-1 flex items-center text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1" /> 10:00 - 11:30 WIB
                </div>
                <div className="mt-1 flex items-center text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> Klien: Bapak Andi (PRB-2026-01)
                </div>
              </div>
              <div className="flex items-center">
                <button className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors">
                  Detail
                </button>
              </div>
            </div>

            <div className="flex p-4 border border-slate-100 bg-white rounded-lg hover:border-slate-200 transition-colors cursor-pointer">
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded border border-slate-200 text-slate-600">
                <span className="text-xs font-bold uppercase">Okt</span>
                <span className="text-lg font-bold">18</span>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-semibold text-slate-900">Jadwal Sidang Mediasi</h4>
                <div className="mt-1 flex items-center text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1" /> 09:00 WIB
                </div>
                <div className="mt-1 flex items-center text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> Pengadilan Negeri Jakarta Selatan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
