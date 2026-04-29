"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  BookOpen, Search, Filter, ArrowRight, 
  Clock, User as UserIcon, RefreshCw, AlertCircle 
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category_id: string;
  created_at: string;
  author: { name: string };
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function EducationListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/educations?limit=20";
      if (selectedCategory) url += `&category_id=${selectedCategory}`;
      
      const [artRes, catRes] = await Promise.all([
        apiFetch(url),
        apiFetch("/categories")
      ]);
      
      setArticles(artRes.data.educations || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Pusat <span className="text-blue-600">Edukasi Hukum</span>
          </h1>
          <p className="text-lg text-slate-600">
            Temukan artikel, panduan, dan berita terbaru seputar hukum Pro Bono di Indonesia. 
            Kami hadir untuk membantu Anda memahami hak-hak hukum Anda secara cuma-cuma.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari judul artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 transition-colors text-slate-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400 ml-2 hidden md:block" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 text-sm font-medium text-slate-700 min-w-[200px]"
            >
              <option value="">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-500">Memperbarui artikel...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
            <BookOpen className="w-16 h-16 mx-auto text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-900">Artikel tidak ditemukan</h3>
            <p className="text-slate-500 mt-2">Coba gunakan kata kunci lain atau pilih kategori berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <Link 
                key={art.id} 
                href={`/edukasi/${art.id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
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
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-3 uppercase font-bold tracking-wider">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {art.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(art.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                    {art.title}
                  </h3>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-bold">Baca Artikel</span>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
