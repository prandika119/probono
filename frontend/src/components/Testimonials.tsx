import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pekerja Bangunan",
      content: "Awalnya saya takut untuk melaporkan sengketa tanah keluarga karena tidak punya uang. Berkat ProBono, saya mendapat pengacara hebat yang mendampingi saya dari awal hingga sertifikat kembali ke tangan kami. Terima kasih banyak!",
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
      content: "Ketika saya di-PHK sepihak tanpa pesangon, saya merasa sangat putus asa. Pengacara dari ProBono membantu mediasi dengan perusahaan hingga hak-hak saya dibayarkan penuh. Pelayanannya sangat profesional meskipun gratis.",
      initial: "A"
    }
  ];

  return (
    <section id="testimoni" className="py-24 bg-brand-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <svg className="absolute w-[800px] h-[800px] -top-96 -left-48" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,95.5,-2.9C94.2,12.2,85.6,26.9,76.5,41.2C67.4,55.5,57.8,69.4,44.7,78.2C31.6,87,15.8,90.7,-0.4,91.4C-16.6,92.1,-33.2,89.8,-47.4,81.4C-61.6,73,-73.4,58.5,-82.1,42.5C-90.8,26.5,-96.4,9,-94.1,-7.2C-91.8,-23.4,-81.6,-38.3,-70.1,-50.2C-58.6,-62.1,-45.8,-71,-31.8,-76.9C-17.8,-82.8,-2.6,-85.7,11.8,-82C26.2,-78.3,42,-68,44.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wide uppercase rounded-full bg-white/10 text-accent-gold mb-4">
            Kisah Sukses
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Membawa Perubahan Nyata</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Dengarkan pengalaman mereka yang telah terbantu dalam memperjuangkan hak-hak hukumnya melalui platform kami.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <svg className="w-10 h-10 text-accent/50 mb-6" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H9.6c.2-2.1 2-3.8 4.2-3.8V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-4.4c.2-2.1 2-3.8 4.2-3.8V8z" />
              </svg>
              <p className="text-slate-200 leading-relaxed mb-8 italic">
                "{testi.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent text-white font-bold flex items-center justify-center text-xl">
                  {testi.initial}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testi.name}</h4>
                  <p className="text-sm text-slate-400">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
