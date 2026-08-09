import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import dummyData from '../../data/dummy.json';
import { FilePlus, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function DashboardMhs() {
  // 1. Konfigurasi Menu Sidebar khusus Mahasiswa
  // Catatan: Pastikan di dalam komponen Sidebar kamu sudah ada penanganan untuk me-render icon ini jika dikirimkan sebagai object. 
  // Jika Sidebar kamu didesain untuk membaca 'activeMenu' string (seperti versi Admin), gunakan properti tersebut.
  // Untuk konsistensi dengan versi Admin kemarin, kita hanya mengirimkan parameter activeMenu.
  
  // Ambil data user mahasiswa dari JSON
  const userData = dummyData.user || {};
  const formattedName = userData.username ? userData.username.charAt(0).toUpperCase() + userData.username.slice(1) : 'Mahasiswa';

  // 2. Data dummy history pengajuan khusus mahasiswa ini
  // Kita asumsikan ini adalah riwayat pribadi si mahasiswa
  const myRequests = [
    { id: 1, jenis: 'Surat Pengantar Penelitian', tanggal: '06 Agustus 2026', status: 'Diproses' },
    { id: 2, jenis: 'Surat Keterangan Mahasiswa', tanggal: '01 Agustus 2026', status: 'Selesai' },
    { id: 3, jenis: 'Surat Keterangan Lulus', tanggal: '28 Juli 2026', status: 'Pending' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Panggil komponen Sidebar, set activeMenu ke 'dashboard' */}
      <Sidebar activeMenu="dashboard" role="mahasiswa" />

      {/* --- KONTEN UTAMA KANAN --- */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        {/* Header Atas (Sesuai Desain Admin) */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Dashboard</h2>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Komponen Notifikasi */}
              <NotificationDropdown />
              
              {/* Komponen Profil */}
              <ProfileDropdown role="mahasiswa" />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">08 Agustus 2026</span>
          </div>
        </header>

        {/* 1. Profil Singkat & Banner */}
        <div className="bg-[#2A5C9A] rounded-[16px] p-8 mb-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-4xl font-bold mb-2">Halo, {formattedName}!</h3>
            <p className="text-[18px] text-white font-light tracking-wide opacity-90">
              Teknik Informatika • {userData.nim || '10119099'}
            </p>
          </div>
          
          {/* Tombol Ajukan Surat (Call to Action) */}
          <Link 
            to="/mhs/ajukan" 
            className="flex items-center gap-2 bg-white text-[#2A60A4] px-6 py-3.5 rounded-[12px] hover:bg-gray-100 transition-colors shadow-md font-bold text-[15px] whitespace-nowrap"
          >
            <FilePlus size={20} strokeWidth={2.5} />
            Ajukan Surat Baru
          </Link>
        </div>

        {/* 2. Kartu Statistik Pribadi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#F3EED9] flex items-center justify-center text-[#CDB04A]">
              <Clock size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Sedang Diproses</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">1</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#DDF1E4] flex items-center justify-center text-[#55A674]">
              <CheckCircle2 size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Surat Selesai</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">1</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#D6E4F0] flex items-center justify-center text-[#5584B0]">
              <FileText size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Total Riwayat</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">2</p>
            </div>
          </div>
          
        </div>

        {/* 3. Tabel Riwayat Singkat */}
        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          
          <div className="px-6 py-4 flex justify-between items-center border-b-[1.5px] border-gray-400">
            <h4 className="text-[17px] font-medium text-gray-800">Status Surat Terakhir</h4>
            <Link to="/mhs/riwayat" className="text-[15px] font-medium text-[#2A60A4] hover:underline">
              Lihat Semua Riwayat
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-3.5 font-semibold w-[40%]">Jenis Surat</th>
                  <th className="px-6 py-3.5 font-semibold w-[20%]">Tanggal Pengajuan</th>
                  <th className="px-6 py-3.5 font-semibold w-[20%]">Status</th>
                  <th className="px-6 py-3.5 font-semibold w-[20%] text-center">Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {myRequests.map((item) => (
                  <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium text-black">{item.jenis}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-black">{item.tanggal}</td>
                    <td className="px-6 py-4">
                      {/* Logika Warna Badge Seragam dengan Admin */}
                      <span className={`px-5 py-1 text-[13px] font-medium rounded-full border ${
                        item.status === 'Pending' 
                          ? 'border-[#D9A036] text-[#D9A036] bg-[#FDF8E9]' 
                          : item.status === 'Diproses'
                            ? 'border-[#2A60A4] text-[#2A60A4] bg-[#E8F0FA]'
                            : 'border-[#429961] text-[#429961] bg-[#E8F5EB]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.status === 'Selesai' ? (
                        <button className="inline-block bg-[#2A60A4] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#1f4b82] transition-colors shadow-sm">
                          Download PDF
                        </button>
                      ) : (
                        <span className="text-[13px] font-medium text-gray-400 italic">Belum Tersedia</span>
                      )}
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