"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, MapPin, CheckCircle, ArrowRight, ArrowLeft, UploadCloud } from "lucide-react";

const steps = [
  { id: 1, name: "Akun Dasar" },
  { id: 2, name: "Identitas Diri" },
  { id: 3, name: "Dokumen Pendukung" },
];

export default function RegisterClientPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/client"; // Arahkan ke dashboard client setelah selesai
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar sebagai Klien</h2>
        <p className="mt-2 text-base text-slate-600">
          Buat akun untuk mengajukan bantuan hukum pro bono.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                  currentStep >= step.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <span className={`mt-2 text-xs font-medium hidden sm:block ${
                currentStep >= step.id ? "text-blue-600" : "text-slate-500"
              }`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Sesuai KTP" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nomor HP / WhatsApp</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="tel" required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="081234567890" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email (Opsional)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="email" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="nama@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Kata Sandi</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="password" required minLength={8} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Minimal 8 karakter" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nomor Induk Kependudukan (NIK)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input type="text" maxLength={16} required className="focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="16 Digit NIK" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Nomor Kartu Keluarga (Opsional)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input type="text" maxLength={16} className="focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="16 Digit No KK" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Alamat Lengkap</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <textarea rows={3} required className="focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Alamat sesuai KTP"></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Provinsi</label>
                    <select required className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border text-slate-700 bg-white shadow-sm">
                      <option value="">Pilih Provinsi</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Kota/Kabupaten</label>
                    <select required className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border text-slate-700 bg-white shadow-sm">
                      <option value="">Pilih Kota</option>
                      <option value="Jakarta Selatan">Jakarta Selatan</option>
                      <option value="Bandung">Bandung</option>
                      <option value="Semarang">Semarang</option>
                      <option value="Surabaya">Surabaya</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload KTP</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-blue-500 transition-colors bg-slate-50 cursor-pointer">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-blue-500" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="file-upload-ktp" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-1">
                          <span>Upload file</span>
                          <input id="file-upload-ktp" name="file-upload-ktp" type="file" className="sr-only" required accept="image/png, image/jpeg, application/pdf" />
                        </label>
                        <p className="pl-1">atau drag & drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Surat Keterangan Tidak Mampu (SKTM)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-blue-500 transition-colors bg-slate-50 cursor-pointer">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-blue-500" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="file-upload-sktm" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-1">
                          <span>Upload file</span>
                          <input id="file-upload-sktm" name="file-upload-sktm" type="file" className="sr-only" required accept="image/png, image/jpeg, application/pdf" />
                        </label>
                        <p className="pl-1">atau drag & drop</p>
                      </div>
                      <p className="text-xs text-slate-500">Syarat wajib bantuan pro bono</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center pt-5 border-t border-slate-200">
          <button
            type="button"
            onClick={handlePrev}
            className={`flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
          >
            {currentStep === 3 ? (
              isLoading ? "Memproses..." : "Daftar Sekarang"
            ) : (
              <>Lanjut <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
