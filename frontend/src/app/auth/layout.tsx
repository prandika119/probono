import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col justify-center h-full">
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <Scale className="h-10 w-10 text-blue-400" />
            <span className="font-bold text-3xl tracking-tight">ProbNect</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Akses Keadilan <br />Hukum untuk Semua
          </h1>
          <p className="text-blue-200 text-lg max-w-md leading-relaxed">
            Platform bantuan hukum gratis untuk masyarakat kurang mampu. Hubungkan klien dengan advokat pro bono secara transparan dan efisien.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-blue-300 max-w-xl mx-auto w-full">
          © {new Date().getFullYear()} ProbNect. All rights reserved.
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:w-[480px]">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-2xl tracking-tight text-blue-900">ProbNect</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
