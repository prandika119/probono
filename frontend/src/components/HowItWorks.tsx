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
    <section id="cara-kerja" className="py-32 bg-white relative">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100">
            Alur Layanan
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">Proses Sederhana & Transparan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium opacity-80">
            Keadilan kini lebih dekat dengan langkah-langkah mudah yang didukung oleh teknologi mutakhir.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-[3px] bg-slate-100 -z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center border-[6px] border-slate-50 shadow-xl mb-8 group-hover:border-blue-50 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
                <span className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">
                  {step.num}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-5 group-hover:text-blue-600 transition-colors">{step.title}</h3>
              <p className="text-slate-500 px-4 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
