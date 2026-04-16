import { Search, Filter, AlertTriangle, Eye, CheckCircle, XCircle } from "lucide-react";

export default function AdminKasusPage() {
  const cases = [
    {
      id: "PRB-NEW-001",
      title: "Gugatan Harta Gono Gini (Modus Penipuan?)",
      client: "Budi P.",
      clientVerified: true,
      category: "Perdata",
      urgency: "Tinggi",
      submittedDate: "1 jam yang lalu",
      aiFlagStatus: "suspicious",
      aiFlagMessage: "Indikasi bukan masyarakat kurang mampu (Nilai sengketa Rp 2 Miliar)."
    },
    {
      id: "PRB-NEW-002",
      title: "Penahanan Ijazah oleh Perusahaan",
      client: "Siti Rahmawati",
      clientVerified: true,
      category: "Ketenagakerjaan",
      urgency: "Sedang",
      submittedDate: "2 jam yang lalu",
      aiFlagStatus: "safe",
      aiFlagMessage: ""
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Moderasi Kasus Baru</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tinjau kasus yang baru diajukan sebelum ditampilkan di Bursa Kasus untuk Advokat.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Cari ID Kasus atau Judul..."
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Kasus
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pengaju
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status Auto-Check
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {cases.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-blue-600">{c.id}</span>
                      <span className="text-sm font-medium text-slate-900 mt-1 max-w-sm truncate">{c.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">{c.category}</span>
                        <span className="text-xs text-slate-400">{c.submittedDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{c.client}</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> SKTM Lolos
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.aiFlagStatus === 'suspicious' ? (
                      <div className="flex items-start text-red-600 bg-red-50 p-2 rounded max-w-xs">
                        <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" />
                        <span className="text-xs leading-tight font-medium">{c.aiFlagMessage}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        <span className="text-xs font-medium">Aman (Validasi Lolos)</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 p-1.5 rounded transition" title="Preview Kasus">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-green-600 hover:text-white bg-green-50 hover:bg-green-600 px-3 py-1.5 rounded text-xs font-bold transition border border-green-200">
                        Setujui
                      </button>
                      <button className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded text-xs font-bold transition border border-red-200">
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
