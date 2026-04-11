import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-900 text-white flex items-center justify-center rounded-xl font-bold text-xl group-hover:scale-105 transition-transform shadow-premium">
            PB
          </div>
          <span className="font-bold text-2xl text-brand-900 tracking-tight">Pro<span className="text-accent">Bono</span></span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-brand-900 hover:text-accent transition-colors">Beranda</Link>
          <Link href="#layanan" className="text-sm font-medium text-slate-600 hover:text-brand-900 transition-colors">Layanan</Link>
          <Link href="#cara-kerja" className="text-sm font-medium text-slate-600 hover:text-brand-900 transition-colors">Cara Kerja</Link>
          <Link href="#testimoni" className="text-sm font-medium text-slate-600 hover:text-brand-900 transition-colors">Testimoni</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-semibold text-brand-900 hover:text-brand-800 px-4 py-2 transition-colors">
            Masuk
          </Link>
          <Link href="/auth/register/client" className="btn-primary py-2.5 px-5 text-sm inline-block text-center rounded-lg">
            Minta Bantuan
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-brand-900 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
