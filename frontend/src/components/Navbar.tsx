"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";

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
  const router = useRouter();

  useEffect(() => {
    // Baca user dari localStorage (sudah di-set saat login/register)
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser({ name: parsed.name, role: parsed.role });
      } catch {
        setUser(null);
      }
    }
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-900 text-white flex items-center justify-center rounded-xl font-bold text-xl group-hover:scale-105 transition-transform shadow-premium">
            PB
          </div>
          <span className="font-bold text-2xl text-brand-900 tracking-tight">
            Pro<span className="text-accent">Bono</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-brand-900 hover:text-accent transition-colors">Beranda</Link>
          <Link href="#layanan" className="text-sm font-medium text-slate-600 hover:text-brand-900 transition-colors">Layanan</Link>
          <Link href="#cara-kerja" className="text-sm font-medium text-slate-600 hover:text-brand-900 transition-colors">Cara Kerja</Link>
          <Link href="#testimoni" className="text-sm font-medium text-slate-600 hover:text-brand-900 transition-colors">Testimoni</Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            // Sudah login → tampilkan nama + ke dashboard + logout
            <>
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 text-sm font-semibold text-brand-900 hover:text-accent px-4 py-2 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Halo, {firstName}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </>
          ) : (
            // Belum login → Masuk + Daftar
            <>
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-brand-900 hover:text-brand-800 px-4 py-2 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register/client"
                className="btn-primary py-2.5 px-5 text-sm inline-block text-center rounded-lg"
              >
                Minta Bantuan
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-brand-900 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className="w-6 h-6" />
            : <Menu className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-md">
          <Link href="/" className="block text-sm font-medium text-slate-700 py-2" onClick={() => setMobileOpen(false)}>Beranda</Link>
          <Link href="#layanan" className="block text-sm font-medium text-slate-600 py-2" onClick={() => setMobileOpen(false)}>Layanan</Link>
          <Link href="#cara-kerja" className="block text-sm font-medium text-slate-600 py-2" onClick={() => setMobileOpen(false)}>Cara Kerja</Link>
          <Link href="#testimoni" className="block text-sm font-medium text-slate-600 py-2" onClick={() => setMobileOpen(false)}>Testimoni</Link>
          <div className="border-t border-slate-100 pt-3 space-y-2">
            {user ? (
              <>
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-2 w-full text-sm font-semibold text-brand-900 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard ({firstName})
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full text-sm font-medium text-red-600 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full text-center text-sm font-semibold text-brand-900 border border-slate-200 rounded-lg py-2.5"
                  onClick={() => setMobileOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register/client"
                  className="block w-full text-center btn-primary text-sm rounded-lg py-2.5"
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
