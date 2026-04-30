import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-[160px] lg:pb-[140px] bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 lg:w-1/2">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-blue-50 text-blue-600 w-fit border border-blue-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                </span>
                Keadilan Untuk Semua
              </div>
              <h1 className="text-4xl font-bold leading-[1.15] text-slate-900 sm:text-5xl lg:text-5xl">
                Keadilan Tanpa Batas, <br />
                <span className="text-blue-600 relative">
                  Bantuan Hukum
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-blue-100 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                  </svg>
                </span> <br />
                Gratis & Terpercaya.
              </h1>
              <p className="text-lg leading-relaxed text-slate-500 max-w-xl font-medium">
                ProbNect menghubungkan Anda dengan ribuan advokat profesional yang siap memberikan pembelaan hukum secara sukarela. Karena hak hukum Anda tidak seharusnya terbatas oleh biaya.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href="/auth/register/client"
                  className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:translate-y-[-1px] transition-all active:scale-95 flex items-center gap-2 text-base"
                >
                  Mulai Konsultasi Gratis
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link 
                  href="/auth/login"
                  className="px-6 py-3.5 font-bold border-2 border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all text-base"
                >
                  Cari Advokat
                </Link>
              </div>
              <div className="flex items-center gap-10 pt-8 border-t border-slate-50">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">2.5k+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Advokat Aktif</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">15k+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kasus Selesai</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">4.9/5</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rating Klien</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 mt-16 lg:mt-0">
            <div className="relative z-10 w-full max-w-[550px] mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100 rounded-full blur-[100px] -z-10 animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-100 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Main Image Container */}
              <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl transition-all duration-500 bg-slate-100 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Simbol Keadilan" 
                  className="w-full h-[500px] lg:h-[650px] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              {/* Verified Badge Card */}
              <div className="absolute top-12 -left-8 lg:-left-16 bg-white/95 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/50 animate-bounce-slow">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status Advokat</div>
                  <div className="text-base font-bold text-slate-900">Terverifikasi Resmi</div>
                </div>
              </div>

              {/* Users Joined Card */}
              <div className="absolute bottom-16 -right-4 lg:-right-12 bg-white/95 backdrop-blur-xl py-5 px-6 rounded-2xl flex flex-col items-center shadow-2xl border border-white/50 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                <div className="flex -space-x-3 mb-4">
                  {[10, 11, 12, 13, 14].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm z-10">
                    +2k
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Warga Terbantu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
