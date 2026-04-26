"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, Home, FileText,
  MessageSquare, Bell, User, LogOut, Scale, Users, Shield, Pencil
} from "lucide-react";
import { apiFetch, getToken } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  verification_status: string;
  profile_image?: string | null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const roleFromPath = pathname?.startsWith("/admin")
    ? "admin"
    : pathname?.startsWith("/advokat")
    ? "advokat"
    : "client";

  // Fetch current user profile
  useEffect(() => {
    if (!getToken()) return;
    apiFetch("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Token invalid — logout
        handleLogout();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync sidebar state when profile page dispatches an update event
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setUser(prev => prev ? { ...prev, ...e.detail } : prev);
    };
    window.addEventListener("probono:profile-updated", handler as EventListener);
    return () => window.removeEventListener("probono:profile-updated", handler as EventListener);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
    document.cookie = "role=; path=/; max-age=0; SameSite=Strict";
    router.push("/auth/login");
  };


  const getNavigation = () => {
    if (roleFromPath === "client") {
      return [
        { name: "Dashboard", href: "/client", icon: Home },
        { name: "Kasus Saya", href: "/client/kasus", icon: FileText },
        { name: "Ajukan Kasus", href: "/client/kasus/baru", icon: Scale },
        { name: "Pesan", href: "/client/chat", icon: MessageSquare },
      ];
    } else if (roleFromPath === "advokat") {
      return [
        { name: "Dashboard", href: "/advokat", icon: Home },
        { name: "Telusuri Kasus", href: "/advokat/explore", icon: FileText },
        { name: "Kasus Aktif", href: "/advokat/kasus", icon: Scale },
        { name: "Pesan", href: "/advokat/chat", icon: MessageSquare },
      ];
    } else {
      return [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Verifikasi Pengguna", href: "/admin/verifikasi", icon: Shield },
        { name: "Kelola Pengguna", href: "/admin/users", icon: Users },
        { name: "Kelola Kategori", href: "/admin/kategori", icon: FileText },
      ];
    }
  };

  const navigation = getNavigation();
  const displayName = user?.name ?? "Memuat...";
  const displayRole = user?.role?.toLowerCase() ?? roleFromPath;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const verificationBadge = displayRole === "admin" ? null : user?.verification_status === "PENDING" ? (
    <span className="mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
      Menunggu Verifikasi
    </span>
  ) : user?.verification_status === "VERIFIED" ? (
    <span className="mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
      Terverifikasi ✓
    </span>
  ) : null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-72 lg:flex-col ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-slate-900">ProBono</span>
          </Link>
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          {/* User info card — clickable, links to profile page */}
          <Link
            href={`/${roleFromPath}/profil`}
            className="mb-8 px-2 flex items-start gap-3 group rounded-xl hover:bg-slate-50 py-2 -mx-2 transition-colors"
          >
            <div className="relative h-12 w-12 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-200 shrink-0 overflow-hidden">
              {user?.profile_image ? (
                <img src={`/api/v1${user.profile_image}`} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-slate-100 h-full w-full flex items-center justify-center text-slate-600">
                  {initials || "?"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 capitalize">{displayRole}</p>
              {verificationBadge}
            </div>
            <Pencil className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 shrink-0" />
          </Link>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const bestMatch = [...navigation]
                .sort((a, b) => b.href.length - a.href.length)
                .find((n) => pathname === n.href || pathname?.startsWith(`${n.href}/`));
              
              const isActive = bestMatch?.href === item.href;
              const bgClass = isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
              return (
                <Link key={item.name} href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${bgClass}`}>
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <button onClick={handleLogout}
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <button type="button" className="text-slate-500 hover:text-slate-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <button type="button" className="text-slate-400 hover:text-slate-500 relative">
              <Bell className="h-6 w-6" />
            </button>
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" />
            <div className="flex items-center gap-x-3">
              <span className="hidden lg:block text-sm font-semibold leading-6 text-slate-900 truncate max-w-[160px]">
                {displayName}
              </span>
              {/* Avatar dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold shrink-0 overflow-hidden bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  {user?.profile_image ? (
                    <img src={`/api/v1${user.profile_image}`} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    initials || <User className="h-4 w-4" />
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                    <Link
                      href={`/${roleFromPath}/profil`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Edit Profil
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
