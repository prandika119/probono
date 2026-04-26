import React from 'react';

export default function Eligibility() {
  const criteria = [
    {
      title: "Masyarakat Kurang Mampu",
      desc: "Memiliki Surat Keterangan Tidak Mampu (SKTM) dari kelurahan/desa setempat atau terdaftar dalam program bantuan sosial pemerintah.",
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    },
    {
      title: "Pencari Keadilan Marginal",
      desc: "Kelompok rentan seperti perempuan korban kekerasan, penyandang disabilitas, dan anak yang berhadapan dengan hukum.",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    },
    {
      title: "Kasus Non-Komersial",
      desc: "Bantuan diutamakan untuk kasus perdata dasar, pidana dengan ancaman tinggi yang butuh bantuan wajib, dan sengketa struktural.",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    }
  ];

  return (
    <section id="kriteria" className="py-32 bg-slate-50 relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-wider uppercase rounded-full bg-blue-50 text-blue-600 mb-6 border border-blue-100">
              Kriteria Penerima
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-8 leading-tight">Siapa yang Berhak <br/>Menerima Bantuan?</h2>
            <p className="text-slate-500 leading-relaxed mb-10 text-xl font-medium">
              Sesuai dengan Undang-Undang Bantuan Hukum, layanan pro bono ini didedikasikan bagi mereka yang membutuhkan perlindungan hukum namun terkendala keterbatasan finansial.
            </p>
            
            <div className="space-y-6">
              {criteria.map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-blue-200">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[3rem] transform translate-x-4 translate-y-4 opacity-10"></div>
              <div className="relative bg-white rounded-[3rem] overflow-hidden aspect-[4/3] flex items-center justify-center border-8 border-white shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&auto=format&fit=crop" 
                  alt="Keadilan" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl flex items-center gap-6 shadow-2xl border border-slate-100 animate-bounce-slow">
                <div className="text-5xl font-black text-blue-600">100%</div>
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  Tanpa Pungutan <br /> Biaya Apapun
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
