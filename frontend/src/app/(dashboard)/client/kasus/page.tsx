import Link from "next/link";
import { Scale, CheckCircle, Clock, AlertCircle, FileText, ChevronRight, Filter } from "lucide-react";

export default function RiwayatKasusPage() {
  const cases = [
    {
      id: "PRB-2026-01",
      title: "Sengketa Tanah Waris dengan Keluarga",
      category: "Tanah & Properti",
      date: "12 Okt 2026",
      status: "in_progress",
      statusLabel: "In Progress",
      lawyer: "Budi Santoso, S.H.",
      urgency: "Tinggi",
    },
    {
      id: "PRB-2026-02",
      title: "PHK Sepihak Tanpa Pesangon",
      category: "Ketenagakerjaan",
      date: "05 Sep 2026",
      status: "completed",
      statusLabel: "Selesai",
      lawyer: "Siti Aminah, S.H., M.H.",
      urgency: "Sedang",
    },
    {
      id: "PRB-2026-03",
      title: "Penipuan Jual Beli Online",
      category: "Pidana",
      date: "20 Agu 2026",
      status: "rejected",
      statusLabel: "Ditolak (Bukan Wewenang)",
      lawyer: "-",
      urgency: "Rendah",
    }
  ];

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
          <button className="flex items-center px-4 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <Link href="/client/kasus/baru" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
            Ajukan Kasus
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <ul role="list" className="divide-y divide-slate-200">
          {cases.map((item) => (
            <li key={item.id} className="hover:bg-slate-50 transition-colors block">
              <Link href={`/client/kasus/${item.id}`} className="block px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-semibold text-blue-600 truncate">{item.id}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                      item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.statusLabel}
                    </span>
                  </div>
                  <div className="flex flex-shrink-0 ml-2">
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0 sm:ml-6">
                      <Scale className="mr-1.5 h-4 w-4 shrink-0 text-slate-400" />
                      {item.category}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                    <Clock className="mr-1.5 h-4 w-4 shrink-0 text-slate-400" />
                    <p>Advokat: <span className="font-medium text-slate-700">{item.lawyer}</span></p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
