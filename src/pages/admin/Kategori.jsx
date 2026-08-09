import React, { useState } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';
import dummyData from '../../data/dummy.json';
import { Bell, Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function Kategori() {
  // Data dummy kategori surat
  const [ kategoriSurat, setKategoriSurat] = useState(dummyData.kategoriSurat);

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Panggil Sidebar dan set activeMenu ke 'kategori' */}
      <Sidebar activeMenu="kategori" />

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        {/* Header (Title, Date, Profile) - Dibuat konsisten dengan Dashboard */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Kategori Surat</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Kelola jenis dan format surat yang tersedia untuk mahasiswa.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <ProfileDropdown />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">04 Agustus 2026</span>
          </div>
        </header>

        {/* Toolbar: Search dan Tombol Tambah */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex items-center bg-white border border-gray-300 rounded-[12px] px-4 py-3 w-full md:w-80 focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari kategori surat..." 
              className="w-full ml-3 outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Tombol Tambah */}
          <button className="flex items-center gap-2 bg-[#2A60A4] text-white px-6 py-3 rounded-[12px] hover:bg-[#1f4b82] transition-colors shadow-md font-semibold text-[15px]">
            <Plus size={20} strokeWidth={2.5} />
            Tambah Kategori
          </button>
        </div>

        {/* Tabel Kategori */}
        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[15px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[5%] text-center">No</th>
                  <th className="px-6 py-4 font-semibold w-[35%]">Nama Kategori</th>
                  <th className="px-6 py-4 font-semibold w-[45%]">Deskripsi / Keterangan</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {kategoriSurat.map((item, index) => (
                  <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                    <td className="px-6 py-5 text-[15px] text-black font-medium text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[15px] font-bold text-[#2A60A4]">{item.nama}</div>
                    </td>
                    <td className="px-6 py-5 text-[14px] text-gray-700 leading-relaxed pr-10">
                      {item.deskripsi}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <button className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-[#2A60A4] hover:border-[#2A60A4] rounded-lg transition-colors shadow-sm" title="Edit Kategori">
                          <Edit size={18} strokeWidth={2} />
                        </button>
                        <button className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 rounded-lg transition-colors shadow-sm" title="Hapus Kategori">
                          <Trash2 size={18} strokeWidth={2} />
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