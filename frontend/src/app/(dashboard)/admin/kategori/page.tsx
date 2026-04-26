"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, Plus, Trash2, RefreshCw, AlertCircle, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  type?: string;
}

export default function KelolaCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/categories?type=case");
      setCategories(res.data.categories || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch("/categories", {
        method: "POST",
        body: { name: newCategoryName.trim(), type: "CASE" },
      });
      setNewCategoryName("");
      setShowAddModal(false);
      fetchCategories();
    } catch (err: any) {
      alert("Gagal menambahkan kategori: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Operasi ini tidak dapat dibatalkan jika kategori tidak sedang digunakan.`)) return;
    setDeletingId(id);
    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err: any) {
      alert("Gagal menghapus kategori: " + err.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Kategori</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tambah atau hapus kategori hukum yang tersedia pada formulir pengajuan kasus.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCategories} disabled={loading}
            className="flex items-center px-4 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Category List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-sm text-slate-500">Memuat kategori...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-base font-medium text-slate-900">Belum ada kategori</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">Tambahkan kategori hukum pertama untuk platform Pro Bono.</p>
            <button onClick={() => setShowAddModal(true)}
              className="text-sm font-medium text-blue-600 hover:underline">
              Tambah kategori sekarang
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {categories.map((cat, index) => (
              <li key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 w-6 text-right">{index + 1}.</span>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-900">{cat.name}</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                    {cat.type || "CASE"}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  disabled={deletingId === cat.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors disabled:opacity-50">
                  {deletingId === cat.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
        {!loading && categories.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">{categories.length} kategori terdaftar</p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Tambah Kategori Baru</h2>
              <button onClick={() => { setShowAddModal(false); setNewCategoryName(""); }}
                className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Kategori
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                  placeholder="Contoh: Hukum Perlindungan Konsumen"
                  className="block w-full px-4 py-3 text-sm border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-slate-500 mt-1.5">Kategori ini akan tersedia sebagai pilihan saat klien mengajukan kasus baru.</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button"
                  onClick={() => { setShowAddModal(false); setNewCategoryName(""); }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting}
                  className="flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70">
                  {submitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Menyimpan...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Tambahkan</>
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
