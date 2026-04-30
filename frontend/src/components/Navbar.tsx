"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Menu, X, ChevronRight } from "lucide-react";

interface UserInfo {
  name: string;
  role: string;
}

function getDashboardPath(role: string): string {
  switch (role?.toLowerCase()) {
    case "client":   return "/client";
    case "lawyer":   return "/advokat";
    case "admin":    return "/admin";
    default:         return "/";
  }
}

export default function Navbar() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser({ name: parsed.name, role: parsed.role });
      } catch {
        setUser(null);
      }
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
    document.cookie = "role=; path=/; max-age=0; SameSite=Strict";
    setUser(null);
    router.push("/");
  };

  const dashboardPath = user ? getDashboardPath(user.role) : "/";
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 flex justify-center ${
      scrolled ? "pt-6 px-4" : "pt-0 px-0"
    }`}>
      <div className={`container mx-auto transition-all duration-700 ease-in-out ${
        scrolled 
          ? "max-w-5xl bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 rounded-[2.5rem] px-12 h-16" 
          : "max-w-7xl bg-white/0 border-b border-transparent px-10 lg:px-12 h-24"
      } flex items-center justify-between`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-lg group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
            PN
          </div>
          <span className={`font-bold text-xl tracking-tighter transition-colors duration-500 ${scrolled ? "text-slate-900" : "text-slate-900"}`}>
            Prob<span className="text-blue-600">Nect</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-12">
          {[
            { name: "Beranda", href: "/" },
            { name: "Layanan", href: "#layanan" },
            { name: "Edukasi", href: "/edukasi" },
            { name: "Cara Kerja", href: "#cara-kerja" },
            { name: "Testimoni", href: "#testimoni" }
          ].map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="relative text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 text-[11px] font-bold text-slate-900 hover:text-blue-600 px-3 py-2 transition-colors uppercase tracking-wider"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-red-600 px-3 py-2 rounded-xl transition-colors border border-slate-100 hover:border-red-100 uppercase tracking-wider"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[11px] font-bold text-slate-900 hover:text-blue-600 px-4 py-2 transition-colors uppercase tracking-widest"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register/client"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 text-[11px] inline-flex items-center gap-2 text-center rounded-xl transition-all shadow-lg shadow-blue-100 hover:translate-y-[-2px] uppercase tracking-widest"
              >
                Minta Bantuan
                <ChevronRight className="w-3 h-3" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-slate-900 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className="w-7 h-7" />
            : <Menu className="w-7 h-7" />
          }
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute top-24 left-6 right-6 lg:hidden bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <Link href="/" className="block text-lg font-bold text-slate-900 uppercase tracking-widest" onClick={() => setMobileOpen(false)}>Beranda</Link>
          <Link href="#layanan" className="block text-lg font-bold text-slate-500 uppercase tracking-widest" onClick={() => setMobileOpen(false)}>Layanan</Link>
          <Link href="/edukasi" className="block text-lg font-bold text-slate-500 uppercase tracking-widest" onClick={() => setMobileOpen(false)}>Edukasi</Link>
          <Link href="#cara-kerja" className="block text-lg font-bold text-slate-500 uppercase tracking-widest" onClick={() => setMobileOpen(false)}>Cara Kerja</Link>
          <Link href="#testimoni" className="block text-lg font-bold text-slate-500 uppercase tracking-widest" onClick={() => setMobileOpen(false)}>Testimoni</Link>
          <div className="border-t border-slate-100 pt-8 space-y-4">
            {user ? (
              <>
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-3 w-full text-lg font-bold text-slate-900 py-2 uppercase tracking-widest"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 text-blue-600" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full text-lg font-bold text-red-500 py-2 uppercase tracking-widest"
                >
                  <LogOut className="h-5 w-5" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full text-center text-lg font-bold text-slate-900 border-2 border-slate-100 rounded-2xl py-4 uppercase tracking-widest"
                  onClick={() => setMobileOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register/client"
                  className="block w-full text-center bg-blue-600 text-white font-bold text-lg rounded-2xl py-4 shadow-xl shadow-blue-200 uppercase tracking-widest"
                  onClick={() => setMobileOpen(false)}
                >
                  Minta Bantuan
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
