"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        auth: false,
        body: { email, password },
      });

      const { access_token, user } = result.data;
      const role = user.role?.toLowerCase();

      // Persist session
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${access_token}; path=/; max-age=3600; SameSite=Strict`;
      document.cookie = `role=${role}; path=/; max-age=3600; SameSite=Strict`;

      // Redirect based on role
      if (role === "client") {
        window.location.href = "/client";
      } else if (role === "lawyer" || role === "advokat") {
        window.location.href = "/advokat";
      } else if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      let errorMsg = err.message || "Email atau password salah.";
      if (errorMsg.toLowerCase().includes("invalid credentials") || errorMsg.toLowerCase().includes("invalid credential")) {
        errorMsg = "Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali.";
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat datang kembali</h2>
        <p className="mt-2 text-base text-slate-600">Masuk ke akun Anda untuk melanjutkan proses bantuan hukum.</p>
      </div>

      <div className="mt-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email atau Nomor HP</label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input id="email" name="email" type="text" autoComplete="email" required
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none transition-colors"
                placeholder="nama@email.com" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Kata Sandi</label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none transition-colors"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">Ingat saya</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Lupa kata sandi?</a>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">Masuk <ArrowRight className="h-4 w-4" /></span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-600 mb-5 font-medium text-center">Belum punya akun?</p>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/auth/register/client"
              className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Daftar Klien
            </Link>
            <Link href="/auth/register/advokat"
              className="w-full flex justify-center py-2.5 px-4 border border-blue-200 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
              Daftar Advokat
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
