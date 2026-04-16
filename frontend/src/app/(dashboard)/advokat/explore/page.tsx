import Link from "next/link";
import { Filter, Search, MapPin, Scale, ChevronRight, AlertCircle } from "lucide-react";

export default function AdvokatExplorePage() {
  const cases = [
    {
      id: "PRB-2026-15",
      title: "Pendampingan Korban KDRT dan Proses Cerai Gugat",
      category: "Hukum Keluarga",
      location: "Jakarta Selatan, DKI Jakarta",
      urgency: "Tinggi",
      urgencyColor: "text-red-700 bg-red-100",
      description: "Klien merupakan ibu rumah tangga yang mengalami KDRT selama 3 tahun terakhir dan diusir dari rumah tanpa diberikan nafkah untuk 2 anaknya. Membutuhkan pendampingan segera untuk gugat cerai dan hak asuh anak.",
      datePosted: "2 jam yang lalu"
    },
    {
      id: "PRB-2026-12",
      title: "Gugatan Pemutusan Hubungan Kerja (PHK) Sepihak Maskapai Penerbangan",
      category: "Ketenagakerjaan",
      location: "Tangerang, Banten",
      urgency: "Sedang",
      urgencyColor: "text-yellow-700 bg-yellow-100",
      description: "Klien di-PHK secara sepihak dengan alasan efisiensi perusahaan namun tidak diberikan pesangon sesuai UU Cipta Kerja. Berkas kontrak kerja dan slip gaji sudah lengkap diunggah ke sistem.",
      datePosted: "1 hari yang lalu"
    },
    {
      id: "PRB-2026-10",
      title: "Sengketa Batas Tanah Perkebunan dengan Perusahaan Swasta",
      category: "Tanah & Properti",
      location: "Banyuwangi, Jawa Timur",
      urgency: "Sedang",
      urgencyColor: "text-yellow-700 bg-yellow-100",
      description: "Klien adalah kelompok petani (5 KK) yang tanahnya diserobot oleh perusahaan perkebunan. Mereka memiliki letter C namun tidak memiliki sertifikat hak milik resmi. Mohon konsultasi awal dan pendampingan mediasi.",
      datePosted: "2 hari yang lalu"
    },
    {
      id: "PRB-2026-08",
      title: "Tuduhan Penggelapan Dana UMKM (Kriminalisasi)",
      category: "Hukum Pidana",
      location: "Bandung, Jawa Barat",
      urgency: "Tinggi",
      urgencyColor: "text-red-700 bg-red-100",
      description: "Klien dituduh menggelapkan dana koperasi, padahal klien adalah korban penipuan oleh oknum pengurus lain. Saat ini klien bersatus saksi namun terancam dinaikkan menjadi tersangka. Butuh advokat pidana secepatnya.",
      datePosted: "3 hari yang lalu"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Telusuri Kasus Pro Bono</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar kasus dari klien kurang mampu yang telah lolos verifikasi kelengkapan SKTM oleh Admin.
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
          <select className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border text-slate-700 bg-white">
            <option value="">Semua Kategori</option>
            <option value="pidana">Pidana</option>
            <option value="perdata">Perdata</option>
            <option value="ketenagakerjaan">Ketenagakerjaan</option>
            <option value="keluarga">Hukum Keluarga</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            <Filter className="w-4 h-4 mr-2" />
            Filter Lanjutan
          </button>
        </div>
      </div>

      {/* List of Cases */}
      <div className="space-y-4">
        {cases.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.urgencyColor}`}>
                    Urgensi {item.urgency}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">{item.datePosted}</span>
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
                    {item.location}
                  </div>
                  <div className="flex items-center">
                    <Scale className="w-4 h-4 mr-1.5 text-slate-400" />
                    ID Kasus: {item.id}
                  </div>
                </div>
              </div>
              
              <div className="md:w-48 shrink-0 md:text-right mt-4 md:mt-0 flex flex-col md:items-end justify-between h-full">
                <button className="w-full md:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm mb-3">
                  Terima Kasus
                </button>
                <button className="w-full md:w-auto px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                  Detail Berkas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Mock */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-lg mt-6 shadow-sm">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-700">
              Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">4</span> dari <span className="font-medium">45</span> kasus
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Previous</span>
                <ChevronRight className="h-5 w-5 rotate-180" aria-hidden="true" />
              </a>
              <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                1
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                2
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                3
              </a>
              <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
