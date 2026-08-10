import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import ConfirmModal from '../../components/ConfirmModal';
import dummyData from '../../data/dummy.json';
import { Search, Download, Info } from 'lucide-react';

export default function RiwayatPengajuan() {
  // Ambil data riwayat dari JSON, fallback ke array kosong kalau belum ada
  const [riwayat, setRiwayat] = useState(dummyData.riwayatMahasiswa || []);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Popup Download Modal
  const [downloadModal, setDownloadModal] = useState({
    isOpen: false,
    message: ''
  });

  // Fitur pencarian berdasarkan Jenis Surat ATAU ID Tiket
  const filteredRiwayat = riwayat.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.jenis?.toLowerCase().includes(searchLower) ||
      item.id?.toString().toLowerCase().includes(searchLower)
    );
  });

  // --- FUNGSI DOWNLOAD PDF ---
  const handleDownload = (id, jenisSurat) => {
    setDownloadModal({
      isOpen: true,
      message: `Mendownload file PDF untuk pengajuan:\n${jenisSurat} (ID Tiket: ${id})`
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Sidebar Aktif di menu 'riwayat' */}
      <Sidebar activeMenu="riwayat" role="mahasiswa" />

      {/* --- KONTEN UTAMA KANAN --- */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        {/* Header Atas */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Riwayat Pengajuan</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Pantau status surat yang Anda ajukan dan unduh berkas yang sudah selesai.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown role="mahasiswa" />
              <ProfileDropdown role="mahasiswa" />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">10 Agustus 2026</span>
          </div>
        </header>

        {/* Toolbar: Search Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center bg-white border border-gray-300 rounded-[12px] px-4 py-3 w-full md:w-[400px] focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm transition-all">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari ID Tiket atau Jenis Surat..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ml-3 outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabel Riwayat */}
        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[15%]">ID Tiket</th>
                  <th className="px-6 py-4 font-semibold w-[30%]">Jenis Surat</th>
                  <th className="px-6 py-4 font-semibold w-[15%]">Tanggal</th>
                  <th className="px-6 py-4 font-semibold w-[20%]">Status & Keterangan</th>
                  <th className="px-6 py-4 font-semibold w-[20%] text-center">Aksi / Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {filteredRiwayat.length > 0 ? (
                  filteredRiwayat.map((item) => (
                    <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                      <td className="px-6 py-5">
                        <span className="font-bold text-[#2A60A4]">{item.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[15px] font-semibold text-gray-800">{item.jenis}</div>
                      </td>
                      <td className="px-6 py-5 text-[14px] text-gray-700 font-medium">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-start gap-2">
                          {/* Logika Warna Badge Status */}
                          <span className={`px-4 py-1 text-[12px] font-bold rounded-full border ${
                            item.status === 'Pending' ? 'border-[#D9A036] text-[#D9A036] bg-[#FDF8E9]' :
                            item.status === 'Diproses' ? 'border-[#2A60A4] text-[#2A60A4] bg-[#E8F0FA]' :
                            item.status === 'Ditolak' ? 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]' :
                            'border-[#429961] text-[#429961] bg-[#E8F5EB]' // Selesai
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                          
                          {/* Keterangan tambahan (alasan ditolak / posisi surat) */}
                          <div className="flex items-start gap-1.5 mt-1 text-gray-500">
                            <Info size={14} className="mt-0.5 flex-shrink-0" />
                            <span className="text-[12px] leading-tight max-w-[200px]">
                              {item.keterangan || 'Tidak ada keterangan tambahan.'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {item.status === 'Selesai' ? (
                            <button 
                              onClick={() => handleDownload(item.id, item.jenis)}
                              className="flex items-center gap-2 bg-[#2A60A4] text-white px-5 py-2.5 rounded-[8px] hover:bg-[#1f4b82] transition-colors shadow-sm font-semibold text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                              <Download size={16} strokeWidth={2.5} />
                              Unduh PDF
                            </button>
                          ) : item.status === 'Ditolak' ? (
                            <Link 
                              to="/mhs/ajukan" 
                              className="text-[13px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
                            >
                              Harap ajukan ulang
                            </Link>
                          ) : (
                            <span className="text-[13px] font-medium text-gray-400 italic">
                              Belum Tersedia
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Tidak ada riwayat pengajuan surat yang cocok dengan pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <ConfirmModal 
        isOpen={downloadModal.isOpen}
        onClose={() => setDownloadModal(prev => ({ ...prev, isOpen: false }))}
        message={downloadModal.message}
        type="download"
        showCancel={false}
        confirmText="Tutup"
      />

    </div>
  );
}