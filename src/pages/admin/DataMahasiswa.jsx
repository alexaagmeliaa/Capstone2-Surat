import React, { useState } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';
import dummyData from '../../data/dummy.json';
import { Search, Bell, Plus, FileUp, Edit, Trash2 } from 'lucide-react';

export default function DataMahasiswa() {
  // Ambil data mahasiswa dari JSON
  const [mahasiswa, setMahasiswa] = useState(dummyData.dataMahasiswa);

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Sidebar dengan menu aktif 'mahasiswa' */}
      <Sidebar activeMenu="mahasiswa" />

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Data Mahasiswa</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Kelola basis data mahasiswa STMIK untuk keperluan administrasi surat.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <ProfileDropdown />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">07 Agustus 2026</span>
          </div>
        </header>

        {/* Toolbar: Search & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          
          {/* Search Bar */}
          <div className="flex items-center bg-white border border-gray-300 rounded-[12px] px-4 py-3 w-full md:w-[350px] focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari NIM atau Nama Mahasiswa..." 
              className="w-full ml-3 outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-[#2A60A4] text-[#2A60A4] px-5 py-3 rounded-[12px] hover:bg-[#E8F0FA] transition-colors shadow-sm font-semibold text-[14px]">
              <FileUp size={18} strokeWidth={2.5} />
              Import Data
            </button>
            <button className="flex items-center gap-2 bg-[#2A60A4] text-white px-5 py-3 rounded-[12px] hover:bg-[#1f4b82] transition-colors shadow-sm font-semibold text-[14px]">
              <Plus size={18} strokeWidth={2.5} />
              Tambah Mahasiswa
            </button>
          </div>

        </div>

        {/* Tabel Data Mahasiswa */}
        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[15%]">NIM</th>
                  <th className="px-6 py-4 font-semibold w-[30%]">Nama Mahasiswa</th>
                  <th className="px-6 py-4 font-semibold w-[20%]">Program Studi</th>
                  <th className="px-6 py-4 font-semibold w-[10%] text-center">Angkatan</th>
                  <th className="px-6 py-4 font-semibold w-[10%] text-center">Status</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {mahasiswa.map((item) => (
                  <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-bold text-[#2A60A4]">{item.nim}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium text-black">{item.nama}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-700">
                      {item.prodi}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-700 text-center">
                      {item.angkatan}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1 text-[12px] font-medium rounded-full border ${
                        item.status === 'Aktif' 
                          ? 'border-[#429961] text-[#429961] bg-[#E8F5EB]' 
                          : 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-[#2A60A4] hover:border-[#2A60A4] rounded-lg transition-colors shadow-sm" title="Edit Data">
                          <Edit size={16} strokeWidth={2} />
                        </button>
                        <button className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 rounded-lg transition-colors shadow-sm" title="Hapus Data">
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}