import React from 'react';
import Sidebar from '../../components/Sidebar';

// Import semua icon yang dibutuhkan HANYA dari lucide-react
import { LayoutDashboard, FilePlus, History, Clock, FileText, Plus } from 'lucide-react';

export default function DashboardMhs() {
  // 1. Konfigurasi Menu Sidebar khusus Mahasiswa
  const menuMahasiswa = [
    { label: 'Dashboard', href: '#', icon: <LayoutDashboard size={20} />, active: true },
    { label: 'Ajukan Surat', href: '#', icon: <FilePlus size={20} />, active: false },
    { label: 'Riwayat Pengajuan', href: '#', icon: <History size={20} />, active: false },
  ];

  // 2. Data dummy history pengajuan
  const myRequests = [
    { id: 1, jenis: 'Surat Pengantar Penelitian', tanggal: '06 Agustus 2026', status: 'Diproses' },
    { id: 2, jenis: 'Surat Keterangan Mahasiswa', tanggal: '01 Agustus 2026', status: 'Selesai' },
  ];

  return (
    <div className="flex h-screen bg-[#F5F6F5] font-sans">
      
      {/* Panggil komponen Sidebar, oper title dan datanya */}
      <Sidebar title="E-Surat STMIK" menus={menuMahasiswa} />

      {/* --- KONTEN UTAMA KANAN --- */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Header Atas */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800">Portal Mahasiswa</h2>
          <div className="text-sm font-medium text-gray-500">
            Kamis, 06 Agustus 2026
          </div>
        </header>

        {/* Area Konten Dalam */}
        <div className="p-8 space-y-8 max-w-5xl">
          
          {/* 1. Profil Singkat & Tombol Aksi Cepat */}
          <div className="bg-white p-8 rounded-[20px] border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border-b-[4px] border-b-[#3169B3]">
            <div>
              <h3 className="text-3xl font-black text-[#182D4A]">Halo, Muhammad Fauzi Setiawan!</h3>
              <p className="text-gray-500 mt-2 text-lg font-medium">Teknik Informatika • 10119099</p>
            </div>
            <button className="flex items-center gap-2 bg-[#3169B3] text-white px-6 py-4 rounded-xl hover:bg-[#26538F] transition-colors shadow-md font-bold text-lg whitespace-nowrap">
              <Plus size={24} />
              Ajukan Surat Baru
            </button>
          </div>

          {/* 2. Kartu Statistik Pribadi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-yellow-50 rounded-xl">
                <Clock className="text-yellow-500" size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Surat Diproses</p>
                <p className="text-3xl font-black text-gray-800 mt-1">1</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <FileText className="text-[#3169B3]" size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Riwayat Surat</p>
                <p className="text-3xl font-black text-gray-800 mt-1">2</p>
              </div>
            </div>
          </div>

          {/* 3. Tabel Riwayat Singkat */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h4 className="text-lg font-bold text-gray-800">Status Surat Terakhir</h4>
              <a href="#" className="text-sm font-bold text-[#3169B3] hover:underline">Lihat Semua Riwayat</a>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200 uppercase tracking-wide">
                    <th className="px-6 py-4 font-semibold">Jenis Surat</th>
                    <th className="px-6 py-4 font-semibold">Tanggal Pengajuan</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-gray-800">{item.jenis}</td>
                      <td className="px-6 py-5 text-gray-600 font-medium">{item.tanggal}</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full border ${
                          item.status === 'Menunggu' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          item.status === 'Diproses' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {item.status === 'Selesai' ? (
                          <button className="text-sm font-bold text-[#3169B3] hover:text-[#182D4A] underline">
                            Download PDF
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400 italic font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}