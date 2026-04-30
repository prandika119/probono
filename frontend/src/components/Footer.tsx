import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-24 border-t border-slate-900">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg shadow-blue-900/20">
                PN
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tighter">Prob<span className="text-blue-600">Nect</span></span>
            </Link>
            <p className="max-w-md mb-8 leading-relaxed text-lg font-medium">
              Platform inovatif yang menjembatani masyarakat kurang mampu dengan advokat profesional untuk mendapatkan akses keadilan hukum yang setara dan transparan.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Pintasan</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="#layanan" className="hover:text-blue-500 transition-colors">Layanan Kami</Link></li>
              <li><Link href="#cara-kerja" className="hover:text-blue-500 transition-colors">Cara Kerja</Link></li>
              <li><Link href="#kriteria" className="hover:text-blue-500 transition-colors">Kriteria Penerima</Link></li>
              <li><Link href="#testimoni" className="hover:text-blue-500 transition-colors">Testimoni</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Kontak</h4>
            <ul className="space-y-4 font-bold">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span className="hover:text-white transition-colors">bantuan@probnect.id</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span className="hover:text-white transition-colors">+62 811-1234-5678</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold uppercase tracking-widest opacity-50">
            &copy; {new Date().getFullYear()} ProbNect Indonesia. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
