import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-slate-300 py-16 border-t border-brand-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white text-brand-900 flex items-center justify-center rounded-xl font-bold text-xl shadow-premium">
                PB
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">Pro<span className="text-accent-gold">Bono</span></span>
            </Link>
            <p className="max-w-sm mb-6 leading-relaxed">
              Platform inovatif yang menjembatani masyarakat kurang mampu dengan advokat profesional untuk mendapatkan akses keadilan hukum yang setara.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Pintasan</h4>
            <ul className="space-y-4">
              <li><Link href="#layanan" className="hover:text-white transition-colors">Layanan Kami</Link></li>
              <li><Link href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</Link></li>
              <li><Link href="#kriteria" className="hover:text-white transition-colors">Kriteria Penerima</Link></li>
              <li><Link href="#testimoni" className="hover:text-white transition-colors">Testimoni</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-gold shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>bantuan@probono.id</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-gold shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+62 811-1234-5678</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ProBono Indonesia. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
