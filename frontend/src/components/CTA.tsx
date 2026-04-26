import React from 'react';

export default function CTA() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center z-10 shadow-2xl shadow-blue-200">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
            Keadilan Adalah Hak Anda, <br className="hidden md:block"/> Bukan Sebuah Kemewahan.
          </h2>
          <p className="text-blue-50 max-w-2xl mx-auto text-lg mb-10 font-medium opacity-90">
            Tim advokat pro bono kami siap mendampingi Anda di setiap langkah hukum. Mulai perjuangan Anda hari ini secara gratis dan transparan.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-3">
              Ajukan Bantuan Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all backdrop-blur-md border-2 border-white/20">
              Daftar Sebagai Advokat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
