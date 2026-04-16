import Link from "next/link";
import { User, Send, Paperclip, CheckCircle2, Clock, FileText } from "lucide-react";

export default function AdvokatChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Pesan & Konsultasi Klien</h1>
        <p className="mt-1 text-sm text-slate-500">
          Berkomunikasi dengan klien dan berikan arahan hukum secara efisien.
        </p>
      </div>

      <div className="flex-1 bg-white shadow-sm border border-slate-200 rounded-lg flex overflow-hidden">
        {/* Chat List Sidebar (Hidden on mobile by default) */}
        <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-700">Percakapan Aktif</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Active contact */}
            <div className="p-4 border-b border-slate-100 cursor-pointer bg-blue-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-900">Bapak Andi Saputra</span>
                <span className="text-xs text-slate-500">10:42</span>
              </div>
              <p className="text-xs text-blue-600 font-medium mb-1">Kasus: PRB-2026-01</p>
              <p className="text-sm text-slate-600 truncate">Anda: Baik, saya akan mempelajari d...</p>
            </div>
            
            {/* Another contact */}
            <div className="p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-900">Ibu Siti Aminah</span>
                <span className="text-xs text-slate-500">Kemarin</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-1">Kasus: PRB-2026-05</p>
              <p className="text-sm text-slate-600 truncate">Terima kasih atas bantuannya, bapak.</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-50">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold mr-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Bapak Andi Saputra</h3>
                <Link href="/advokat/kasus" className="text-xs text-blue-600 hover:underline">
                  Klien - PRB-2026-01 (Lihat Berkas)
                </Link>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* System Message */}
            <div className="flex justify-center my-4">
              <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded-full font-medium">
                Sistem: Kasus PRB-2026-01 mulai aktif. Pastikan komunikasi dijaga kerahasiaannya.
              </span>
            </div>

            {/* Client Message */}
            <div className="flex justify-start">
              <div className="flex items-end">
                <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold mr-2 mb-1 shrink-0 text-xs">
                  AS
                </div>
                <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm">
                  <p className="text-sm">Selamat pagi Bapak Budi. Terima kasih telah menerima kasus saya. Saya sudah melampirkan berkas sertifikat tanah dan surat wasiat di sistem.</p>
                  <div className="mt-1 flex items-center justify-end text-[10px] text-slate-400">
                    10:30
                  </div>
                </div>
              </div>
            </div>

            {/* Client Message Attachment */}
            <div className="flex justify-start ml-8">
              <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm flex items-center cursor-pointer hover:bg-slate-50 transition">
                <div className="bg-slate-100 p-2 rounded mr-3 border border-slate-200">
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-600 hover:underline">Surat_Wasiat.pdf</p>
                  <p className="text-xs text-slate-500">2.4 MB</p>
                </div>
              </div>
            </div>

            {/* Lawyer Message */}
            <div className="flex justify-end mt-4">
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                <p className="text-sm">Selamat pagi. Baik, saya akan mempelajari dokumen yang dilampirkan terlebih dahulu. Tolong konfirmasi apakah tanah tersebut saat ini dikuasai oleh pihak keluarga yang Anda maksud?</p>
                <div className="mt-1 flex items-center justify-end text-[10px] text-blue-200">
                  10:42 <CheckCircle2 className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
            
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Ketik balasan untuk klien..." 
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
              />
              <button className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
