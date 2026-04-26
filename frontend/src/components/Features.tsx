import React from 'react';

export default function Features() {
  const features = [
    {
      title: "Verifikasi AI & OCR",
      desc: "Validasi status ekonomi dan NIK secara cepat dan akurat menggunakan teknologi kecerdasan buatan.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.357 11.357 0 00-1.018 4.386c0 4.103 2.184 7.696 5.462 9.77a11.954 11.954 0 0010.312 0c3.278-2.074 5.462-4.567 5.462-9.77a11.356 11.356 0 00-1.018-4.386z"
    },
    {
      title: "Real-time Chat",
      desc: "Konsultasi langsung dengan advokat yang menangani kasus Anda tanpa hambatan waktu dan jarak.",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    },
    {
      title: "Transparansi Kasus",
      desc: "Pantau perkembangan kasus Anda secara real-time melalui sistem log progres yang transparan.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    }
  ];

  return (
    <section id="layanan" className="py-32 relative overflow-hidden bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl text-center">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100">
            Layanan Unggulan
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
            Standar Baru Dalam <br /> Layanan Pro Bono
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group p-10 rounded-[2rem] bg-white transition-all duration-500 hover:-translate-y-3 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-all duration-500 shadow-xl group-hover:rotate-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={f.icon}></path>
                </svg>
              </div>
              <h3 className="relative z-10 text-2xl font-extrabold text-slate-900 mb-5 group-hover:text-blue-600 transition-colors">{f.title}</h3>
              <p className="relative z-10 text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
