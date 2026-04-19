"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Filter, ChevronLeft, ChevronRight, UserX, CheckCircle2, XCircle, Search, RefreshCw, AlertCircle, Eye } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  verification_status: string;
  is_active: boolean;
  nik?: string;
  province?: string;
  city?: string;
  ktp_image?: string | null;
  client?: any;
  lawyer?: any;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("verification_status", statusFilter);
      if (activeFilter !== "") params.append("is_active", activeFilter);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await apiFetch(`/users?${params.toString()}`);
      setUsers(res.data.users || []);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, activeFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveFilter(e.target.value);
    setPage(1);
  };

  const toggleUserStatus = async (userId: string, currentActiveStatus: boolean) => {
    try {
      if (!confirm(`Anda yakin ingin ${currentActiveStatus ? "menonaktifkan" : "mengaktifkan"} user ini?`)) {
        return;
      }
      
      await apiFetch(`/users/${userId}`, {
        method: "PATCH",
        body: { is_active: !currentActiveStatus },
      });
      fetchUsers();
    } catch (err: any) {
      alert("Gagal mengubah status: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Kelola Pengguna
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar seluruh pengguna platform, filter berdasarkan role, status verifikasi, dan keaktifan akun.
          </p>
        </div>
        <button onClick={fetchUsers} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Tabs & Table Container */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        {/* Role Tabs like Verifikasi */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex">
            <button onClick={() => { setRoleFilter(""); setPage(1); }}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                roleFilter === "" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}>
              Semua Pengguna
            </button>
            <button onClick={() => { setRoleFilter("CLIENT"); setPage(1); }}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                roleFilter === "CLIENT" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}>
              Klien
            </button>
            <button onClick={() => { setRoleFilter("LAWYER"); setPage(1); }}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                roleFilter === "LAWYER" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}>
              Advokat
            </button>
            <button onClick={() => { setRoleFilter("ADMIN"); setPage(1); }}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                roleFilter === "ADMIN" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}>
              Admin
            </button>
          </nav>
        </div>

        {/* Secondary Filters */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filter Lanjutan:</span>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <select 
              value={statusFilter} 
              onChange={handleStatusChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
            >
              <option value="">Semua Status Verifikasi</option>
              <option value="VERIFIED">Terverifikasi</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select 
              value={activeFilter} 
              onChange={handleActiveChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
            >
              <option value="">Semua Status Akun</option>
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status Verifikasi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status Akun
                </th>
                {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Aksi
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto" />
                    <p className="mt-2 text-sm text-slate-500">Memuat data pengguna...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">Tidak ada pengguna ditemukan</p>
                    <p className="text-sm text-slate-500 mt-1">Coba sesuaikan filter pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase">
                          {user.name.substring(0, 2)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                          {user.city && (
                            <div className="text-xs text-slate-400">{user.city}, {user.province}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'LAWYER' ? 'bg-indigo-100 text-indigo-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {user.role.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.verification_status === 'VERIFIED' ? (
                        <span className="inline-flex items-center text-sm text-green-600 font-medium">
                          <CheckCircle2 className="mr-1.5 h-4 w-4" /> Terverifikasi
                        </span>
                      ) : user.verification_status === 'PENDING' ? (
                        <span className="inline-flex items-center text-sm text-yellow-600 font-medium">
                          <RefreshCw className="mr-1.5 h-4 w-4" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-sm text-red-600 font-medium">
                          <XCircle className="mr-1.5 h-4 w-4" /> Ditolak / Belum
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    {/* Add action buttons here if needed in the future (e.g. toggle user status) */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="bg-white px-6 py-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Menampilkan data <span className="font-semibold text-slate-900">Halaman {page}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(max => Math.max(1, max - 1))}
              disabled={page === 1 || loading}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
              <span className="sm:hidden">Prev</span>
            </button>
            <div className="hidden sm:flex h-10 min-w-10 px-3 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-sm">
              {page}
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < limit || loading}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
