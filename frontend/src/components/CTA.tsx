import React from 'react';

export default function CTA() {
  return (
    <section className="py-24 bg-white relative pb-32">
      <div className="container mx-auto px-4">
        <div className="bg-brand-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center z-10 shadow-premium">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Jangan Biarkan Biaya <br className="hidden md:block"/> Menghalangi Keadilan Anda
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-10">
            Tim advokat pro bono kami siap membantu Anda memperjuangkan hak-hak secara adil dan transparan. Daftarkan kasus Anda sekarang.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-xl hover:shadow-accent/30 flex items-center justify-center gap-2">
              Ajukan Bantuan Hukum
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all backdrop-blur-sm border border-white/20">
              Gabung Sebagai Advokat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
