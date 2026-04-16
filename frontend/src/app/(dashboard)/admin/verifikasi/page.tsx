"use client";

import { useState } from "react";
import { Check, X, File, Shield, User, MapPin } from "lucide-react";

export default function VerifikasiPage() {
  const [activeTab, setActiveTab] = useState("klien");

  // Mock data
  const clients = [
    { id: "CL-01", name: "Slamet Raharjo", nik: "3201xxxxxxxx0001", province: "Jawa Barat", status: "pending", date: "Hari ini" },
    { id: "CL-02", name: "Ibu Kartini", nik: "3301xxxxxxxx0002", province: "Jawa Tengah", status: "pending", date: "Kemarin" },
  ];

  const lawyers = [
    { id: "LW-01", name: "Arif Budiman, S.H.", org: "PERADI", nia: "12345678", exp: "5 Tahun", status: "pending", date: "Hari ini" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Berkas Pengguna</h1>
        <p className="mt-1 text-sm text-slate-500">
          Proses validasi kelayakan Klien (SKTM & KTP) dan keaslian lisensi Advokat (NIA & KTA).
        </p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("klien")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "klien"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Antrean Verifikasi Klien (SKTM)
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs">2</span>
            </button>
            <button
              onClick={() => setActiveTab("advokat")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "advokat"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Antrean Verifikasi Advokat
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs">1</span>
            </button>
          </nav>
        </div>

        <div className="p-0">
          {activeTab === "klien" && (
            <ul className="divide-y divide-slate-200">
              {clients.map((c) => (
                <li key={c.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{c.name}</h3>
                          <div className="flex items-center text-xs text-slate-500">
                            <span className="mr-3">NIK: {c.nik}</span>
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {c.province}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 max-w-md">
                        <div className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100">
                          <File className="h-8 w-8 text-slate-400 mr-3" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Foto KTP</p>
                            <span className="text-[10px] text-blue-600 font-medium">Klik untuk Preview</span>
                          </div>
                        </div>
                        <div className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100">
                          <File className="h-8 w-8 text-slate-400 mr-3" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Surat SKTM</p>
                            <span className="text-[10px] text-blue-600 font-medium">Klik untuk Preview</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex flex-row md:flex-col gap-2 justify-end pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 md:w-48">
                      <p className="hidden md:block text-xs text-slate-500 mb-2 text-right">Mendaftar: {c.date}</p>
                      <button className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </button>
                      <button className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md transition-colors">
                        <X className="h-4 w-4 mr-2" /> Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "advokat" && (
            <ul className="divide-y divide-slate-200">
              {lawyers.map((a) => (
                <li key={a.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <Shield className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{a.name}</h3>
                          <div className="flex items-center text-xs text-slate-500">
                            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mr-3">{a.org}</span>
                            <span className="mr-3">NIA: {a.nia}</span>
                            <span>Pengalaman: {a.exp}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 max-w-md">
                        <div className="border border-slate-200 rounded p-3 flex items-center bg-slate-50 cursor-pointer hover:bg-slate-100">
                          <File className="h-8 w-8 text-slate-400 mr-3" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Kartu Tanda Advokat</p>
                            <span className="text-[10px] text-blue-600 font-medium">Klik untuk Preview</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex flex-row md:flex-col gap-2 justify-end pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 md:w-48">
                      <p className="hidden md:block text-xs text-slate-500 mb-2 text-right">Mendaftar: {a.date}</p>
                      <button className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </button>
                      <button className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md transition-colors">
                        <X className="h-4 w-4 mr-2" /> Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
