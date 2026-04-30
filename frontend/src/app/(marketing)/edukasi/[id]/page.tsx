"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, User as UserIcon, 
  Clock, Tag, ChevronRight 
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function EducationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!id) return;
    
    apiFetch(`/educations/${id}`)
      .then(res => {
        if (res.status === 'success' && res.data?.education) {
          setArticle(res.data.education);
        } else {
          setError("Artikel tidak ditemukan");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium mt-4">Memuat artikel...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md text-center border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Ops! Gagal Memuat</h1>
          <p className="text-slate-600 mb-8">{error || "Data artikel tidak tersedia."}</p>
          <Link href="/edukasi" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pt-32 pb-24 selection:bg-blue-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
          <Link href="/edukasi" className="hover:text-blue-600 transition-colors">Edukasi</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 truncate max-w-[200px]">Detail Artikel</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 shadow-sm">
              <Tag className="w-3 h-3" />
              {article.category?.name || "Hukum Edukasi"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-10 tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-8 border-y border-slate-100 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <UserIcon className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ditulis oleh</p>
                <p className="text-sm font-bold text-slate-900">{article.author?.name || "Admin ProbNect"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Diterbitkan</p>
                <p className="text-sm font-bold text-slate-900">
                  {new Date(article.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Estimasi</p>
                <p className="text-sm font-bold text-slate-900">5 Menit Baca</p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-slate-100">
            <img 
              src={article.image_url} 
              alt="Cover artikel"
              className="w-full h-auto object-cover" 
              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
            />
          </div>
        )}

        {/* Content Body */}
        <div className="max-w-3xl mx-auto">
          <div className="article-content mb-24">
            {article.content && (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            )}
          </div>

          {/* Footer CTA */}
          <div className="bg-blue-600 rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-2xl shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4">Konsultasikan Masalah Anda</h2>
              <p className="text-blue-100 mb-8 max-w-sm mx-auto">Tim advokat kami siap memberikan bantuan hukum cuma-cuma bagi Anda yang membutuhkan.</p>
              <Link href="/kasus/baru" className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-50 transition-all">
                Ajukan Kasus Sekarang
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/edukasi" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Daftar Artikel
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
