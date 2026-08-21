import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, File, Clock, CheckCircle2, Users } from 'lucide-react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';

export default function DashboardAdmin() {
  // State untuk menyimpan data statistik real dari database
  const [stats, setStats] = useState({
    totalPengajuan: 0,
    butuhDiproses: 0,
    suratSelesai: 0,
    totalMahasiswa: 0
  });

  // State untuk menyimpan daftar pengajuan terbaru real dari database
  const [pengajuanTerbaru, setPengajuanTerbaru] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari backend saat halaman dimuat
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Mengisi state statistik dari database
        setStats({
          totalPengajuan: data.stats.total_pengajuan,
          butuhDiproses: data.stats.butuh_diproses,
          suratSelesai: data.stats.surat_selesai,
          totalMahasiswa: data.stats.total_mahasiswa
        });

        // Memformat data pengajuan terbaru agar sesuai dengan struktur tabel
        const formattedLatest = (data.terbaru || []).map(item => ({
          id: item.id,
          nama: item.user?.name || 'Mahasiswa',
          nim: item.user?.nim || '-',
          jenis: item.jenis_surat,
          tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          }),
          status: item.status
        }));

        setPengajuanTerbaru(formattedLatest);
      }
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-putih font-sans">
      
      <Sidebar activeMenu="dashboard" />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Dashboard</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Panel administrasi surat untuk mahasiswa.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
                <NotificationDropdown />
                <ProfileDropdown />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#3171C6] to-[#183760] rounded-[16px] p-8 mb-8 text-white shadow-sm">
          <h3 className="text-4xl font-bold mb-2">Halo, Admin!</h3>
          <p className="text-[20px] text-white font-light tracking-wide">Berikut adalah ringkasan aktivitas administrasi surat hari ini.</p>
        </div>

        {/* 4 Kartu Statistik (Real Data) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#D6E4F0] flex items-center justify-center text-[#5584B0]">
              <File size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Total Pengajuan</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{isLoading ? '...' : stats.totalPengajuan}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#F3EED9] flex items-center justify-center text-[#CDB04A]">
              <Clock size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Butuh Diproses</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{isLoading ? '...' : stats.butuhDiproses}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#DDF1E4] flex items-center justify-center text-[#55A674]">
              <CheckCircle2 size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Surat Selesai</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{isLoading ? '...' : stats.suratSelesai}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#DCE8F5] flex items-center justify-center text-[#5584B0]">
              <Users size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Total Mahasiswa</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{isLoading ? '...' : stats.totalMahasiswa}</p>
            </div>
          </div>
        </div>

        {/* Tabel Pengajuan Terbaru (Real Data) */}
        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b-[1.5px] border-gray-400">
            <h4 className="text-[17px] font-medium text-gray-800">Pengajuan Terbaru</h4>
            <Link to="/ad/pengajuan" className="text-[15px] font-medium text-[#2A60A4] hover:underline">Lihat Semua</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-3.5 font-semibold w-[30%]">Nama / NIM</th>
                  <th className="px-6 py-3.5 font-semibold w-[25%]">Jenis Surat</th>
                  <th className="px-6 py-3.5 font-semibold w-[15%]">Tanggal</th>
                  <th className="px-6 py-3.5 font-semibold w-[15%]">Status</th>
                  <th className="px-6 py-3.5 font-semibold w-[15%] text-center">Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Memuat data...
                    </td>
                  </tr>
                ) : pengajuanTerbaru.length > 0 ? (
                  pengajuanTerbaru.map((item) => (
                    <tr key={item.id} className="bg-[#F4F5F7]">
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-medium text-black">{item.nama}</div>
                        <div className="text-[13px] text-black mt-0.5">{item.nim}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-black">{item.jenis}</td>
                      <td className="px-6 py-4 text-[14px] text-black">{item.tanggal}</td>
                      <td className="px-6 py-4">
                        <span className={`px-5 py-1 text-[13px] font-medium rounded-full border ${
                          item.status === 'Pending' ? 'border-[#D9A036] text-[#D9A036] bg-[#FDF8E9]' :
                          item.status === 'Diproses' ? 'border-[#2A60A4] text-[#2A60A4] bg-[#E8F0FA]' :
                          item.status === 'Ditolak' ? 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]' :
                          'border-[#429961] text-[#429961] bg-[#E8F5EB]' 
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link to="/ad/pengajuan" className="inline-block bg-[#2A60A4] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#1f4b82] transition-colors shadow-sm">
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                      Belum ada pengajuan surat masuk.
                    </td>
                  </tr>
                )}
                
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
    </div>
  );
}