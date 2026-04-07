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
    <section id="kriteria" className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-900 mb-6">Siapa yang Berhak <br/>Menerima Bantuan?</h2>
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              Sesuai dengan Undang-Undang Bantuan Hukum, layanan pro bono ini didedikasikan bagi mereka yang memiliki keterbatasan finansial namun membutuhkan perlindungan hukum yang setara.
            </p>
            
            <div className="space-y-6">
              {criteria.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-accent/30 hover:bg-white hover:shadow-premium transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-900 mb-2">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-900 rounded-[2rem] transform translate-x-4 translate-y-4"></div>
              <div className="relative bg-slate-100 rounded-[2rem] overflow-hidden aspect-[4/3] flex items-center justify-center border border-slate-200">
                {/* Temporary Placeholder for Illustration */}
                <div className="text-center p-8">
                  <svg className="w-32 h-32 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p className="text-slate-500 font-medium">Ilustrasi Kesetaraan Hukum</p>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl flex items-center gap-4 animate-bounce-slow">
                <div className="text-4xl font-black text-brand-900">100%</div>
                <div className="text-sm font-bold text-slate-600">Gratis tanpa pungutan<br/>biaya apapun</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
