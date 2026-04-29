"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, User as UserIcon, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: { name: string };
  category: { name: string };
}

export default function EducationSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/educations?limit=3")
      .then((res) => setArticles(res.data.educations || []))
      .catch((err) => console.error("Gagal memuat artikel", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading && articles.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-slate-500">Memuat artikel edukasi...</p>
        </div>
      </section>
    );
  }

  // Remove early return if empty so the section header still shows

  return (
    <section className="py-24 bg-slate-50 overflow-hidden" id="edukasi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3 h-3" />
              Edukasi Hukum
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pahami Hak Anda Melalui <span className="text-blue-600">Berita & Edukasi</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Kumpulan artikel hukum praktis yang dirancang untuk membantu Anda memahami prosedur hukum di Indonesia dengan mudah.
            </p>
          </div>
          <Link 
            href="/edukasi" 
            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all group"
          >
            Lihat Semua Artikel
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((art) => (
              <Link 
                key={art.id} 
                href={`/edukasi/${art.id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                  {art.image_url ? (
                    <img 
                      src={art.image_url} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-blue-600 shadow-sm uppercase tracking-wide">
                      {art.category.name}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {art.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(art.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
                    {art.title}
                  </h3>
                  <div 
                    className="text-sm text-slate-500 line-clamp-3 mb-6"
                    dangerouslySetInnerHTML={{ __html: art.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." }}
                  />
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-blue-600 text-sm font-bold">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Belum ada artikel edukasi yang diterbitkan saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
