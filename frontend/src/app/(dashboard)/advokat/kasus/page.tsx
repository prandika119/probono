"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, CheckCircle, Clock, AlertCircle, FileText, ChevronRight, MessageSquare, Briefcase, Paperclip } from "lucide-react";

export default function AdvokatKasusPage() {
  const [activeTab, setActiveTab] = useState("aktif");

  const cases = [
    {
      id: "PRB-2026-01",
      title: "Sengketa Tanah Waris dengan Keluarga",
      client: "Andi Saputra",
      category: "Tanah & Properti",
      dateAccepted: "13 Okt 2026",
      status: "in_progress",
      statusLabel: "In Progress",
      nextAction: "Jadwal Mediasi (14 Okt, 10:00)",
    },
    {
      id: "PRB-2025-88",
      title: "Pendampingan Sidang Tipiring",
      client: "Budi Santoso",
      category: "Hukum Pidana",
      dateAccepted: "01 Sep 2026",
      status: "completed",
      statusLabel: "Selesai",
      nextAction: "-",
    }
  ];

  const filteredCases = cases.filter(c => 
    activeTab === 'aktif' ? c.status !== 'completed' : c.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Kasus</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola kasus-kasus yang sedang Anda tangani.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('aktif')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'aktif' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Kasus Aktif
          </button>
          <button 
            onClick={() => setActiveTab('selesai')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'selesai' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Selesai
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p>Tidak ada kasus di kategori ini.</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-200">
            {filteredCases.map((item) => (
              <li key={item.id} className="p-5 sm:px-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-bold text-blue-600 shrink-0">{item.id}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 md:hidden">Diterima: {item.dateAccepted}</p>
                    </div>
                    
                    <h3 className="text-lg font-medium text-slate-900 mb-1">{item.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3">
                      <div className="flex items-center">
                        <Scale className="w-4 h-4 mr-1.5 text-slate-400" />
                        {item.category}
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                        Klien: {item.client}
                      </div>
                      {item.nextAction !== '-' && (
                        <div className="flex items-center text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                          <AlertCircle className="w-4 h-4 mr-1.5" />
                          {item.nextAction}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end md:justify-start gap-2 shrink-0 md:w-32 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                    <button className="flex-1 md:flex-none flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium rounded-md transition-colors">
                      <FileText className="w-4 h-4 mr-1.5" />
                      Detail
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Chat
                    </button>
                  </div>
                </div>
                
                {/* Expandable Management Area for Active Cases */}
                {item.status === 'in_progress' && (
                  <div className="mt-5 bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status & Catatan</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <select className="block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-3 bg-white">
                          <option>In Progress (Sedang Berjalan)</option>
                          <option>Need Info (Menunggu Dokumen Klien)</option>
                          <option>Menunggu Jadwal Sidang</option>
                          <option>Completed (Selesai Berhasil)</option>
                        </select>
                        <textarea rows={2} className="block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-3 bg-white" placeholder="Tambahkan catatan perkembangan kasus..."></textarea>
                      </div>
                      <div className="shrink-0 md:w-48 space-y-2">
                        <button className="w-full flex items-center justify-center px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
                          <Paperclip className="w-4 h-4 mr-1.5" />
                          Upload Dokumen
                        </button>
                        <button className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium rounded-md transition-colors">
                          Simpan Update
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Inline helper icon slightly different to separate import
function UserIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
