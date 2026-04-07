import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Registrasi & Unggah Syarat",
      desc: "Buat akun dan lengkapi dokumen persyaratan seperti KTP dan Surat Keterangan Tidak Mampu (SKTM).",
    },
    {
      num: "02",
      title: "Verifikasi Cerdas AI",
      desc: "Sistem AI dan OCR kami akan memvalidasi keaslian dokumen dan kelayakan penerima bantuan dalam hitungan menit.",
    },
    {
      num: "03",
      title: "Pencocokan Advokat",
      desc: "Algoritma kami mencari dan menghubungkan Anda dengan advokat pro bono yang keahliannya sesuai dengan kasus Anda.",
    },
    {
      num: "04",
      title: "Pendampingan Hukum",
      desc: "Advokat siap memberikan konsultasi dan pendampingan hingga kasus yang Anda hadapi selesai.",
    }
  ];

  return (
    <section id="cara-kerja" className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-900 mb-4">Cara Kerja Kami</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg pt-4 border-t border-slate-200">
            Akses bantuan hukum yang mudah, transparan, dan terpercaya dengan alur yang disederhanakan melalui teknologi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-900/10 via-accent/30 to-brand-900/10 -z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-slate-50 shadow-premium mb-6 group-hover:border-accent/20 transition-all duration-300">
                <span className="text-2xl font-black text-brand-900 group-hover:text-accent transition-colors">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-4 px-2">{step.title}</h3>
              <p className="text-slate-600 px-4 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
