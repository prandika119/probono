"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Phone, CheckCircle, ArrowRight, ArrowLeft, UploadCloud,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const steps = [
  { id: 1, name: "Akun Dasar" },
  { id: 2, name: "Identitas Diri" },
  { id: 3, name: "Dokumen Pendukung" },
];

export default function RegisterClientPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [sktmFile, setSktmFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    nik: "",
    address: "",
    province: "",
    city: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ktpFile)   { alert("Harap upload foto KTP terlebih dahulu.");  return; }
    if (!sktmFile)  { alert("Harap upload SKTM terlebih dahulu."); return; }
    setIsLoading(true);

    try {
      // Step 1: Register
      setStatusMsg("Mendaftarkan akun...");
      const regResult = await apiFetch("/auth/register", {
        method: "POST",
        auth: false,
        body: { ...formData, role: "CLIENT" },
      });
      const userId = regResult.data.user.id;

      // Step 2: Auto login untuk dapat token
      setStatusMsg("Mengautentikasi...");
      const loginResult = await apiFetch("/auth/login", {
        method: "POST",
        auth: false,
        body: { email: formData.email, password: formData.password },
      });
      const token = loginResult.data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loginResult.data.user));
      document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;
      document.cookie = `role=client; path=/; max-age=3600; SameSite=Strict`;

      // Step 3: Upload KTP
      setStatusMsg("Mengupload KTP...");
      const ktpForm = new FormData();
      ktpForm.append("ktp_image", ktpFile);
      await apiFetch(`/users/${userId}/upload-ktp`, { method: "POST", body: ktpForm });

      // Step 4: Upload SKTM
      setStatusMsg("Mengupload SKTM...");
      const sktmForm = new FormData();
      sktmForm.append("sktm_file", sktmFile);
      await apiFetch(`/users/${userId}/upload-sktm`, { method: "POST", body: sktmForm });

      setStatusMsg("Selesai! Mengarahkan ke dashboard...");
      window.location.href = "/client";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
      setStatusMsg("");
    }
  };

  const FileDropZone = ({
    id, label, file, setFile, icon: Icon,
    hint,
  }: {
    id: string; label: string; file: File | null;
    setFile: (f: File | null) => void;
    icon?: React.ElementType; hint: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors bg-slate-50 cursor-pointer ${
        file ? "border-green-400 bg-green-50" : "border-slate-300 hover:border-blue-500"
      }`}>
        <div className="space-y-1 text-center">
          <UploadCloud className={`mx-auto h-12 w-12 ${file ? "text-green-500" : "text-blue-500"}`} />
          <div className="flex text-sm text-slate-600 justify-center">
            <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 px-1">
              <span>{file ? "Ganti file" : "Upload file"}</span>
              <input id={id} type="file" className="sr-only" accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            {!file && <p className="pl-1">atau drag & drop</p>}
          </div>
          {file
            ? <p className="text-xs text-green-600 font-medium">✓ {file.name}</p>
            : <p className="text-xs text-slate-500">{hint}</p>
          }
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar sebagai Klien</h2>
        <p className="mt-2 text-base text-slate-600">Buat akun untuk mengajukan bantuan hukum pro bono.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
        <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                currentStep >= step.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <span className={`mt-2 text-xs font-medium hidden sm:block ${currentStep >= step.id ? "text-blue-600" : "text-slate-500"}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Sesuai KTP" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nomor HP / WhatsApp</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-400" /></div>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="081234567890" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="nama@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kata Sandi</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Minimal 8 karakter" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700">NIK (16 Digit)</label>
                  <input type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength={16} required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="16 Digit NIK" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Alamat Lengkap (sesuai KTP)</label>
                  <textarea rows={3} name="address" value={formData.address} onChange={handleChange} required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Alamat sesuai KTP" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Provinsi</label>
                    <select name="province" value={formData.province} onChange={handleChange} required
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border text-slate-700 bg-white shadow-sm">
                      <option value="">Pilih Provinsi</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                      <option value="Banten">Banten</option>
                      <option value="Sumatera Utara">Sumatera Utara</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Kota/Kabupaten</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Contoh: Depok" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">ℹ️ Upload dokumen identitas Anda</p>
                  <p className="text-xs text-blue-600 mt-1">Dokumen akan diverifikasi oleh admin sebelum akun Anda aktif sepenuhnya.</p>
                </div>
                <FileDropZone id="ktp-upload" label="Foto KTP" file={ktpFile} setFile={setKtpFile} hint="PNG, JPG, PDF maks. 5MB" />
                <FileDropZone id="sktm-upload" label="Surat Keterangan Tidak Mampu (SKTM)" file={sktmFile} setFile={setSktmFile} hint="Syarat wajib bantuan pro bono" />
                {statusMsg && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    {statusMsg}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between items-center pt-5 border-t border-slate-200">
          <button type="button" onClick={handlePrev}
            className={`flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors ${currentStep === 1 ? "opacity-0 pointer-events-none" : ""}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </button>
          <button type="submit" disabled={isLoading}
            className="flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-colors">
            {currentStep === 3
              ? (isLoading ? "Memproses..." : "Daftar & Masuk")
              : <><span>Lanjut</span><ArrowRight className="h-4 w-4 ml-2" /></>
            }
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
