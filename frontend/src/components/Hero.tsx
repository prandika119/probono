import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 lg:w-1/2">
            <div className="flex flex-col gap-6">
              <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wide uppercase rounded-full bg-accent/10 text-accent w-fit">
                Keadilan Untuk Semua
              </span>
              <h1 className="text-4xl font-bold leading-tight text-brand-900 sm:text-5xl lg:text-6xl">
                Bantuan Hukum <br />
                <span className="text-accent underline decoration-accent-gold/30 decoration-8 underline-offset-8">Gratis</span> Untuk Anda
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 max-w-xl">
                Menjembatani masyarakat kurang mampu dengan para advokat profesional yang siap memberikan bantuan hukum secara sukarela (Pro Bono). Dapatkan keadilan tanpa hambatan biaya.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="btn-primary flex items-center gap-2">
                  Ajukan Bantuan Sekarang
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button className="px-6 py-3 font-medium border-2 rounded-lg border-brand-900/10 text-brand-900 hover:bg-brand-900/5 transition-all">
                  Pelajari Lebih Lanjut
                </button>
              </div>
              <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-brand-900">500+</div>
                  <div className="text-sm text-slate-500">Advokat Terdaftar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-900">1.2k</div>
                  <div className="text-sm text-slate-500">Kasus Selesai</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-900">98%</div>
                  <div className="text-sm text-slate-500">Kepuasan Klien</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative z-10 w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent-gold/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-brand-900/20 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Main Image Container */}
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/60 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 bg-brand-900 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/60 to-transparent z-10 mix-blend-overlay group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop" 
                  alt="Simbol Keadilan" 
                  className="w-full h-[450px] lg:h-[550px] object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                />
              </div>

              {/* Verified Badge Card */}
              <div className="absolute top-16 -left-8 lg:-left-12 glass-card p-4 rounded-2xl flex items-center gap-4 animate-bounce-slow shadow-xl border border-white/40">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/30">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium tracking-wide">Status Advokat</div>
                  <div className="text-base font-bold text-brand-900">Terverifikasi Peradi</div>
                </div>
              </div>

              {/* Users Joined Card */}
              <div className="absolute bottom-20 -right-4 lg:-right-8 glass-card py-4 px-6 rounded-2xl flex flex-col items-center animate-bounce-slow shadow-xl border border-white/40" style={{ animationDelay: '1.5s' }}>
                <div className="flex -space-x-4 mb-3">
                  {[10, 11, 12, 13].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-accent text-white flex items-center justify-center text-xs font-bold shadow-sm z-10">
                    +99
                  </div>
                </div>
                <div className="text-sm font-bold text-brand-900">Pencari Keadilan Terbantu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
