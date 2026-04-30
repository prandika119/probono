import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pekerja Bangunan",
      content: "Awalnya saya takut untuk melaporkan sengketa tanah keluarga karena tidak punya uang. Berkat ProbNect, saya mendapat pengacara hebat yang mendampingi saya dari awal hingga sertifikat kembali ke tangan kami. Terima kasih banyak!",
      initial: "B"
    },
    {
      name: "Siti Rahmawati",
      role: "Ibu Rumah Tangga",
      content: "Sistem verifikasinya sangat cepat. Hanya dalam 2 hari setelah mengunggah SKTM, saya sudah bisa chat langsung dengan advokat ibu kota. Kasus KDRT yang saya alami akhirnya ditangani secara serius di jalur hukum yang tepat.",
      initial: "S"
    },
    {
      name: "Agus Pratama",
      role: "Buruh Pabrik",
      content: "Ketika saya di-PHK sepihak tanpa pesangon, saya merasa sangat putus asa. Pengacara dari ProbNect membantu mediasi dengan perusahaan hingga hak-hak saya dibayarkan penuh. Pelayanannya sangat profesional meskipun gratis.",
      initial: "A"
    }
  ];

  return (
    <section id="testimoni" className="py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-white/10 text-blue-400 mb-4 border border-white/10">
            Kisah Sukses
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Membawa Perubahan Nyata</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium opacity-80">
            Dengarkan pengalaman mereka yang telah terbantu dalam memperjuangkan hak-hak hukumnya melalui platform kami.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testi, idx) => (
            <div key={idx} className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.07] hover:border-blue-500/30 transition-all duration-500">
              <div className="mb-8 flex items-center justify-between">
                <svg className="w-12 h-12 text-blue-500/40" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H9.6c.2-2.1 2-3.8 4.2-3.8V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-4.4c.2-2.1 2-3.8 4.2-3.8V8z" />
                </svg>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
              <p className="text-slate-200 leading-relaxed mb-10 text-lg font-medium italic">
                "{testi.content}"
              </p>
              <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                  {testi.initial}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-lg">{testi.name}</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
