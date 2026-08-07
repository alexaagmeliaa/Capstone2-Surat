import React, { useState } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import Sidebar from '../../components/Sidebar';
import dummyData from '../../data/dummy.json';
import { Search, XCircle, Bell, Clock, CheckCircle2, Eye } from 'lucide-react';

export default function KelolaPengajuan() {
  const [requests, setRequests] = useState(dummyData.pengajuanTerbaru);

  // Fungsi mengubah status
  const handleUpdateStatus = (id, newStatus) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="kelola" />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Kelola Surat</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Lihat dan proses permintaan surat dari mahasiswa.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center rounded-full border-[1.5px] border-[#2A60A4] text-[#2A60A4] bg-[#F4F5F7] hover:bg-blue-50 transition-colors">
                <Bell size={24} strokeWidth={1.5} />
              </button>
                < ProfileDropdown />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">06 Agustus 2026</span>
          </div>
        </header>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center bg-white border border-gray-300 rounded-[12px] px-4 py-3 w-full md:w-80 focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari NIM atau Nama..." 
              className="w-full ml-3 outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[30%]">Nama / NIM</th>
                  <th className="px-6 py-4 font-semibold w-[25%]">Jenis Surat</th>
                  <th className="px-6 py-4 font-semibold w-[15%]">Tanggal</th>
                  <th className="px-6 py-4 font-semibold w-[15%]">Status</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {/* Looping menggunakan variabel requests dari state */}
                {requests.map((item) => (
                  <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium text-black">{item.nama}</div>
                      <div className="text-[13px] text-black mt-0.5">{item.nim}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-black">{item.jenis}</td>
                    <td className="px-6 py-4 text-[14px] text-black">{item.tanggal}</td>
                    <td className="px-6 py-4">
                      {/* Cek kondisi termasuk "Pending" dari JSON */}
                      <span className={`px-4 py-1.5 text-[13px] font-medium rounded-full border ${
                        item.status === 'Pending' || item.status === 'Diterima'
                          ? 'border-[#D9A036] text-[#D9A036] bg-[#FDF8E9]' // Kuning
                          : item.status === 'Diproses'
                            ? 'border-[#2A60A4] text-[#2A60A4] bg-[#E8F0FA]' // Biru
                            : item.status === 'Ditolak' 
                              ? 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]' // Merah
                              : 'border-[#429961] text-[#429961] bg-[#E8F5EB]' // Hijau (Selesai)
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        
                        {/* Tombol Lihat: Selalu muncul di semua status */}
                        <button 
                          className="p-2 bg-white border border-gray-400 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                          title="Lihat Detail Surat"
                        >
                          <Eye size={18} strokeWidth={2} />
                        </button>

                        {/* Jika status PENDING/DITERIMA: Muncul Proses & Tolak */}
                        {(item.status === 'Pending' || item.status === 'Diterima') && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'Diproses')}
                              className="p-2 bg-white border border-[#2A60A4] text-[#2A60A4] hover:bg-[#E8F0FA] rounded-lg transition-colors shadow-sm"
                              title="Mulai Proses Surat"
                            >
                              <Clock size={18} strokeWidth={2} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'Ditolak')}
                              className="p-2 bg-white border border-[#E05252] text-[#E05252] hover:bg-[#FCEAEA] rounded-lg transition-colors shadow-sm"
                              title="Tolak Surat"
                            >
                              <XCircle size={18} strokeWidth={2} />
                            </button>
                          </>
                        )}

                        {/* Jika status DIPROSES: Muncul tombol Selesai */}
                        {item.status === 'Diproses' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'Selesai')}
                            className="p-2 bg-white border border-[#429961] text-[#429961] hover:bg-[#E8F5EB] rounded-lg transition-colors shadow-sm flex items-center gap-2 px-3"
                            title="Tandai Selesai"
                          >
                            <CheckCircle2 size={18} strokeWidth={2} />
                            <span className="text-[13px] font-medium hidden lg:inline">Selesai</span>
                          </button>
                        )}

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