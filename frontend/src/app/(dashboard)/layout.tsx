"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Home, FileText, 
  MessageSquare, Bell, User, Settings, 
  LogOut, Scale, ChevronRight 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Simple role detection from URL for UI mocking
  const role = pathname?.startsWith("/admin") 
    ? "admin" 
    : pathname?.startsWith("/advokat") 
    ? "advokat" 
    : "client";

  const getNavigation = () => {
    if (role === 'client') {
      return [
        { name: 'Dashboard', href: '/client', icon: Home },
        { name: 'Kasus Saya', href: '/client/kasus', icon: FileText },
        { name: 'Ajukan Kasus', href: '/client/kasus/baru', icon: Scale },
        { name: 'Pesan', href: '/client/chat', icon: MessageSquare },
      ];
    } else if (role === 'advokat') {
      return [
        { name: 'Dashboard', href: '/advokat', icon: Home },
        { name: 'Telusuri Kasus', href: '/advokat/explore', icon: FileText },
        { name: 'Kasus Aktif', href: '/advokat/kasus', icon: Scale },
        { name: 'Pesan', href: '/advokat/chat', icon: MessageSquare },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Verifikasi', href: '/admin/verifikasi', icon: User },
        { name: 'Kelola Kasus', href: '/admin/kasus', icon: FileText },
      ];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-72 lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
          <div className="mb-8 px-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {role === 'client' ? 'C' : role === 'advokat' ? 'A' : 'AD'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 capitalize">{role}</p>
              <p className="text-xs text-slate-500">Terverifikasi</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              // Special handling to allow active states for sub-routes
              const isActive = pathname === item.href || (item.href !== `/${role}` && pathname?.startsWith(item.href));
              const bgClass = isActive
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${bgClass}`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <button className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <button type="button" className="text-slate-400 hover:text-slate-500 relative">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true"></div>
            <div className="flex items-center gap-x-4 cursor-pointer">
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-semibold leading-6 text-slate-900 capitalize" aria-hidden="true">
                  Profil {role}
                </span>
              </span>
              <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden flex justify-center items-center">
                <User className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Main section */}
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
