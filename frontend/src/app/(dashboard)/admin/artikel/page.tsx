"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  FileText, Plus, Trash2, Edit, RefreshCw, 
  AlertCircle, X, Search, Image as ImageIcon,
  ExternalLink, Calendar, User, BookOpen
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-md" />
});

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

export default function AdminArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/educations");
      setArticles(res.data.educations || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiFetch("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchArticles();
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  // Hook must be called before early return
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  }), []);

  // Early return for hydration safety (After all hooks)
  if (!mounted) return null;

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingId(article.id);
      setTitle(article.title);
      setCategoryId(article.category_id);
      setContent(article.content);
      setPreviewUrl(article.image_url);
    } else {
      setEditingId(null);
      setTitle("");
      setCategoryId("");
      setContent("");
      setPreviewUrl(null);
    }
    setCoverImage(null);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return alert("Pilih kategori terlebih dahulu");
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category_id", categoryId);
    formData.append("content", content);
    if (coverImage) {
      formData.append("cover_image", coverImage);
    }

    try {
      const url = editingId ? `/educations/${editingId}` : "/educations";
      const method = editingId ? "PATCH" : "POST";
      
      await apiFetch(url, {
        method,
        body: formData,
      });

      setShowModal(false);
      fetchArticles();
    } catch (err: any) {
      alert("Gagal menyimpan artikel: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus artikel "${name}"?`)) return;
    try {
      await apiFetch(`/educations/${id}`, { method: "DELETE" });
      fetchArticles();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edukasi & Artikel</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola konten edukasi hukum untuk ditampilkan di halaman depan.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tulis Artikel
        </button>
      </div>

      {/* Article List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-sm text-slate-500">Memuat artikel...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Belum ada artikel</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              Mulailah mengedukasi masyarakat dengan menulis artikel hukum pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Artikel</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Penulis</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0">
                          {art.image_url ? (
                            <img src={art.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[250px]">
                          <p className="text-sm font-bold text-slate-900 truncate">{art.title}</p>
                          <a href={`/edukasi/${art.id}`} target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1">
                            Lihat di web <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {art.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {art.author.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(art.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(art)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(art.id, art.title)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 rounded-t-xl">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Metadata */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gambar Cover</label>
                    <div 
                      onClick={() => document.getElementById('cover-input')?.click()}
                      className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group"
                    >
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs font-medium">Ganti Gambar</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                          <span className="text-[10px] text-slate-500">Klik untuk upload gambar</span>
                        </>
                      )}
                    </div>
                    <input id="cover-input" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                    <select 
                      value={categoryId} 
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right: Title & Content */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Artikel</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Masukkan judul artikel yang menarik..."
                      className="block w-full px-4 py-2 text-lg font-bold border-b border-slate-200 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konten Artikel</label>
                    <div className="prose-sm">
                      <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent}
                        modules={quillModules}
                        className="h-80 mb-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50">
                  Batal
                </button>
                <button type="submit" disabled={submitting}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
                >
                  {submitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Menyimpan...</>
                  ) : (
                    "Terbitkan Artikel"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
