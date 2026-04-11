"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, UploadCloud, AlertTriangle } from "lucide-react";

const steps = [
  { id: 1, name: "Informasi Dasar" },
  { id: 2, name: "Detail Kejadian" },
  { id: 3, name: "Bukti & Tujuan" },
];

export default function PengajuanKasusPage() {
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
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/client/kasus"; 
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-center mb-6">
        <Link href="/client" className="text-slate-500 hover:text-blue-600 mr-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ajukan Kasus Baru</h1>
          <p className="mt-1 text-sm text-slate-500">Lengkapi formulir di bawah ini agar kami dapat memahami masalah hukum Anda secara detail.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl px-6 py-8 md:p-10 mb-8">
        {/* Progress Bar */}
        <div className="mb-10 relative px-4">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-4 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 2rem)' }}
          ></div>
          
          <div className="relative flex justify-between z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 shadow-sm border-2 ${
                    currentStep >= step.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.id}
                </div>
                <span className={`mt-2 text-xs font-medium absolute top-12 whitespace-nowrap text-center ${
                  currentStep >= step.id ? "text-blue-600" : "text-slate-500"
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="mt-14">
          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Judul Kasus</label>
                    <p className="text-xs text-slate-500 mb-2">Tuliskan inti permasalahan hukum Anda dengan singkat.</p>
                    <input type="text" required minLength={10} className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Contoh: Sengketa Tanah Waris dengan Keluarga" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Kategori Hukum</label>
                    <select required className="mt-1 block w-full px-3 py-3 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white">
                      <option value="">Pilih Kategori</option>
                      <option value="pidana">Hukum Pidana</option>
                      <option value="perdata">Hukum Perdata</option>
                      <option value="ketenagakerjaan">Hukum Ketenagakerjaan</option>
                      <option value="keluarga">Hukum Keluarga (Cerai, Waris)</option>
                      <option value="tanah">Tanah & Properti</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Tingkat Urgensi</label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {['Rendah', 'Sedang', 'Tinggi'].map((level) => (
                        <label key={level} className="relative flex cursor-pointer border border-slate-200 rounded-lg bg-white p-4 shadow-sm focus:outline-none hover:bg-slate-50">
                          <input type="radio" name="urgency" value={level} className="sr-only" required />
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <p className="font-medium text-slate-900">{level}</p>
                              </div>
                            </div>
                            <div className={`shrink-0 text-${level === 'Tinggi' ? 'red' : level === 'Sedang' ? 'yellow' : 'blue'}-500`}>
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                          </div>
                          {/* Checked ring decoration handled via CSS focus-within ideally, simplified here */}
                        </label>
                      ))}
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
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Deskripsi Kasus & Kronologi Singkat</label>
                    <p className="text-xs text-slate-500 mb-2">Jelaskan apa yang terjadi sejak awal hingga masalah ini muncul.</p>
                    <textarea rows={6} required minLength={50} className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Pada tanggal... saya mengalami..."></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Tanggal Kejadian Pertama</label>
                      <input type="date" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Estimasi Kerugian (Jika ada)</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 sm:text-sm">Rp</span>
                        </div>
                        <input type="number" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="1000000" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Pihak Lawan (Jika ada)</label>
                      <input type="text" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Nama perusahaan atau mantan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Lokasi Kejadian / Sengketa</label>
                      <input type="text" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Nama kota atau keterangan lokasi" />
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
                    <label className="block text-sm font-medium text-slate-700">Tujuan Bantuan Hukum</label>
                    <p className="text-xs text-slate-500 mb-2">Apa harapan Anda dari bantuan hukum ini? (Misal: Konsultasi, Pendampingan Sidang, Somasi).</p>
                    <textarea rows={3} required className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 sm:text-sm border-slate-300 rounded-md py-3 border outline-none" placeholder="Saya berharap dapat dimediasi terlebih dahulu..."></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Dokumen Bukti Pendukung</label>
                    <p className="text-xs text-slate-500 mb-4">Maksimal 5 file. Bisa berupa foto, perjanjian, laporan kepolisian, dll.</p>
                    <div className="flex justify-center px-6 pt-8 pb-10 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-slate-50 cursor-pointer">
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 px-1 py-1 px-2 border shadow-sm">
                            <span>Upload Dokumen</span>
                            <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" accept="image/*, application/pdf" />
                          </label>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">PNG, JPG, PDF up to 10MB total</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handlePrev}
              className={`flex items-center px-5 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-2.5 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:shadow-none"
            >
              {currentStep === 3 ? (
                isLoading ? "Mensubmit..." : "Ajukan Kasus Sekarang"
              ) : (
                <>Selanjutnya <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
