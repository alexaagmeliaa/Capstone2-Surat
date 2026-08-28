import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import ConfirmModal from '../../components/ConfirmModal';
import { FilePlus, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function DashboardMhs() {
  const [user, setUser] = useState({});
  const [suratList, setSuratList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Popup Modal Download
  const [downloadModal, setDownloadModal] = useState({
    isOpen: false,
    message: ''
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Menggunakan sessionStorage agar terisolasi per tab browser
        const token = sessionStorage.getItem('token');
        
        // 1. Ambil data surat mahasiswa yang sedang login
        const responseSurat = await fetch('http://localhost:8000/api/mahasiswa/surat', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const dataSurat = await responseSurat.json();
        if (responseSurat.ok) {
          const arrayData = Array.isArray(dataSurat) ? dataSurat : (dataSurat.data || []);
          
          const formatted = arrayData.map(item => {
            const rawStatus = (item.status || '').toLowerCase();
            let finalStatus = 'Pending';

            if (rawStatus === 'disetujui' || rawStatus === 'selesai') {
              finalStatus = 'Selesai';
            } else if (rawStatus === 'ditolak') {
              finalStatus = 'Ditolak';
            } else if (rawStatus === 'diproses') {
              finalStatus = 'Diproses';
            }

            return {
              id: item.id,
              jenis: item.jenis_surat || item.judul_surat || item.nama_surat || 'Surat Pengantar',
              tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              }),
              status: finalStatus
            };
          });

          setSuratList(formatted);
        }

        // 2. Ambil data profil user yang sedang login untuk nama & NIM
        const responseUser = await fetch('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (responseUser.ok) {
          const userData = await responseUser.json();
          setUser(userData);
        }

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format Nama Mahasiswa untuk Banner
  const formattedName = user.name 
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1) 
    : 'Mahasiswa';

  // Hitung Statistik Otomatis dari Database
  const totalRiwayat = suratList.length;
  const sedangDiproses = suratList.filter(s => s.status === 'Pending' || s.status === 'Diproses').length;
  const suratSelesai = suratList.filter(s => s.status === 'Selesai').length;

  // Ambil maksimal 3 surat terakhir untuk ditampilkan di tabel
  const myRequests = suratList.slice(0, 3);

  // --- FUNGSI DOWNLOAD PDF ---
  const handleDownload = (id, jenisSurat) => {
    setDownloadModal({
      isOpen: true,
      message: `Mendownload file PDF untuk pengajuan:\n${jenisSurat} (ID: ${id})`
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Panggil komponen Sidebar, set activeMenu ke 'dashboard' */}
      <Sidebar activeMenu="dashboard" role="mahasiswa" />

      {/* --- KONTEN UTAMA KANAN --- */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        {/* Header Atas */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Dashboard</h2>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown role="mahasiswa" />
              <ProfileDropdown role="mahasiswa" />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* 1. Profil Singkat & Banner */}
        <div className="bg-[#2A5C9A] rounded-[16px] p-8 mb-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-4xl font-bold mb-2">Halo, {formattedName}!</h3>
            <p className="text-[18px] text-white font-light tracking-wide opacity-90">
              {user.prodi || 'Teknik Informatika'} • {user.nim || user.email || '-'}
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

        {/* 2. Kartu Statistik Pribadi (Dihitung dari Database) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#F3EED9] flex items-center justify-center text-[#CDB04A]">
              <Clock size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Sedang Diproses</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{sedangDiproses}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#DDF1E4] flex items-center justify-center text-[#55A674]">
              <CheckCircle2 size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Surat Selesai</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{suratSelesai}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-[16px] border-[1.5px] border-gray-300 shadow-[0_8px_15px_rgb(0,0,0,0.05)] flex items-center gap-5">
            <div className="w-[52px] h-[52px] rounded-[12px] bg-[#D6E4F0] flex items-center justify-center text-[#5584B0]">
              <FileText size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Total Riwayat</p>
              <p className="text-[28px] font-bold text-black leading-none mt-1">{totalRiwayat}</p>
            </div>
          </div>
          
        </div>

        {/* 3. Tabel Riwayat Singkat (Status Surat Terakhir) */}
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
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Memuat data...
                    </td>
                  </tr>
                ) : myRequests.length > 0 ? (
                  myRequests.map((item) => (
                    <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-medium text-black">{item.jenis}</div>
                      </td>
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
                        {item.status === 'Selesai' ? (
                          <button 
                            onClick={() => handleDownload(item.id, item.jenis)}
                            className="inline-block bg-[#2A60A4] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#1f4b82] transition-colors shadow-sm"
                          >
                            Download PDF
                          </button>
                        ) : (
                          <span className="text-[13px] font-medium text-gray-400 italic">Belum Tersedia</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Belum ada riwayat pengajuan surat.
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