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
    <section id="layanan" className="py-24 relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 skew-x-12 translate-x-32 -z-10"></div>
      
      <div className="container mx-auto px-4 text-center">
        <div className="mb-16">
          <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wide uppercase rounded-full bg-accent/10 text-accent mb-4">
            Keunggulan Kami
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-900 border-b-4 border-accent-gold pb-4 inline-block">
            Mengapa Memilih ProBono?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-2 border border-slate-100 shadow-sm hover:shadow-premium relative z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="w-16 h-16 bg-brand-900 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-accent transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon}></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-brand-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
