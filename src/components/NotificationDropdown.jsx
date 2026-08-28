import React, { useState, useRef, useEffect } from 'react';
import { Bell, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDropdown({ role = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State untuk menyimpan daftar notifikasi dan ID unik user aktif
  const [notifications, setNotifications] = useState([]);
  const [uId, setUid] = useState(null);

  // Helper untuk mengambil ID notifikasi yang sudah dibaca dari sessionStorage
  const getReadNotifIds = (userId) => {
    try {
      const saved = sessionStorage.getItem(`read_notifs_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper untuk mengubah format waktu menjadi relatif (cth: "2 jam lalu")
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Baru saja';
    const diffMs = new Date() - new Date(dateString);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari lalu`;
  };

  // Fungsi utama untuk menarik data notifikasi dari Backend API
  const loadNotifications = async () => {
    try {
      // 🟢 MENGGUNAKAN SESSIONSTORAGE: Mengambil token autentikasi yang sesuai
      const token = sessionStorage.getItem('token');
      if (!token) return;

      // Menyesuaikan endpoint berdasarkan role ('admin' atau 'mahasiswa')
      const endpointSurat = role === 'admin' 
        ? 'http://localhost:8000/api/admin/surat' 
        : 'http://localhost:8000/api/mahasiswa/surat';

      // Tarik data user dan data surat secara serentak (Promise.all)
      const [resUser, resSurat] = await Promise.all([
        fetch('http://localhost:8000/api/user', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        }),
        fetch(endpointSurat, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        })
      ]);

      let activeUid = role === 'admin' ? 'admin_user' : 'guest';
      if (resUser.ok) {
        const userData = await resUser.json();
        activeUid = userData.id || userData.email || activeUid;
        setUid(activeUid);
        sessionStorage.setItem('cached_user_data', JSON.stringify(userData));
      }

      if (resSurat.ok) {
        const dataSurat = await resSurat.json();
        const arraySurat = Array.isArray(dataSurat) ? dataSurat : (dataSurat.data || []);
        
        const readIds = getReadNotifIds(activeUid);
        const prefix = role === 'admin' ? 'admin' : 'mhs';

        // Format data surat menjadi bentuk notifikasi yang mudah dibaca
        const formatted = arraySurat.map(surat => {
          const notifId = `${prefix}_surat_${surat.id}_${surat.status}`;
          const jenisSurat = surat.jenis_surat || surat.judul_surat || 'Surat Pengantar';
          const mhsName = surat.user?.name || 'Mahasiswa';
          const timeStr = getRelativeTime(surat.created_at || surat.updated_at);
          const isRead = readIds.includes(notifId);

          let message = '';
          let type = 'info';

          if (role === 'admin') {
            if (surat.status === 'Pending') {
              message = `${mhsName} baru saja mengajukan ${jenisSurat}.`;
              type = 'pengajuan';
            } else if (surat.status === 'Diproses') {
              message = `${jenisSurat} dari ${mhsName} sedang dalam proses.`;
            } else if (surat.status === 'Selesai') {
              message = `Pemrosesan ${jenisSurat} untuk ${mhsName} selesai.`;
            } else {
              message = `Pengajuan ${jenisSurat} milik ${mhsName} telah ditolak.`;
            }
          } else {
            // Logika pesan notifikasi untuk sisi Mahasiswa secara real-time
            if (surat.status === 'Selesai') {
              message = `Hore! Pengajuan ${jenisSurat} Anda telah selesai diproses!`;
            } else if (surat.status === 'Ditolak') {
              message = `Mohon maaf, pengajuan ${jenisSurat} Anda ditolak.`;
            } else if (surat.status === 'Diproses') {
              message = `Pengajuan ${jenisSurat} Anda sedang dikerjakan oleh Admin.`;
            } else {
              message = `Pengajuan ${jenisSurat} Anda berhasil dikirim ke Admin.`;
              type = 'pengajuan';
            }
          }

          return {
            id: notifId,
            message,
            time: timeStr,
            isRead,
            type,
            timestamp: new Date(surat.created_at || surat.updated_at).getTime()
          };
        });

        // Urutkan dari yang paling baru
        formatted.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(formatted);
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    }
  };

  // 🟢 POLLING AUTO-REFRESH SETIAP 5 DETIK: Memperbarui notifikasi secara otomatis
  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [role]);

  // Menutup dropdown jika pengguna mengklik di luar area komponen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menghitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  // Fungsi untuk menandai seluruh notifikasi sudah dibaca
  const markAllAsRead = () => {
    let currentUid = uId;
    if (!currentUid) {
      const cached = sessionStorage.getItem('cached_user_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        currentUid = parsed.id || parsed.email;
      } else {
        currentUid = role === 'admin' ? 'admin_user' : 'guest';
      }
    }

    const allIds = notifications.map(n => n.id);
    sessionStorage.setItem(`read_notifs_${currentUid}`, JSON.stringify(allIds));
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  // Menentukan jalur redirect ke halaman pengaturan/setting sesuai role
  const settingPath = role === 'mahasiswa' ? '/mhs/setting' : '/ad/setting';

  const renderMessageText = (notif) => {
    return (
      <>
        <span className={notif.isRead ? 'text-gray-700' : 'text-gray-800 font-semibold'}>
          {notif.message}{' '}
        </span>
        <span className={`block mt-1 text-[12px] font-bold ${notif.isRead ? 'text-gray-500' : 'text-[#3470B9]'}`}>
          {notif.time}
        </span>
      </>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Tombol Lonceng (Bell) di Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 flex items-center justify-center rounded-full border-[1.5px] border-[#2A60A4] text-[#2A60A4] bg-[#F4F5F7] hover:bg-blue-50 transition-colors focus:outline-none"
      >
        <Bell size={22} fill="currentColor" strokeWidth={1} />
        
        {/* Badge Merah indikator notifikasi belum dibaca */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Kotak Kotak Dropdown Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-[#F4F5F7] border border-gray-300 rounded-[16px] shadow-2xl z-50 overflow-hidden flex flex-col">
          
          <div className="absolute -top-2 right-4 w-4 h-4 bg-[#EAECEF] rotate-45 border-t border-l border-gray-300 z-0"></div>

          {/* Header Dropdown */}
          <div className="bg-[#EAECEF] px-5 py-4 flex justify-between items-center border-b border-gray-300 relative z-10">
            <h3 className="text-[15px] font-bold text-gray-800 tracking-wide">NOTIFIKASI</h3>
            <button 
              onClick={markAllAsRead}
              className="text-[#3470B9] text-[14px] font-medium hover:underline focus:outline-none"
            >
              Tandai semua dibaca
            </button>
          </div>

          {/* Bagian Daftar Isi Notifikasi */}
          <div className="p-4 flex flex-col gap-3 max-h-[350px] overflow-y-auto bg-[#F4F5F7] relative z-10 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-[16px] border flex gap-4 items-center transition-colors ${
                    notif.isRead 
                      ? 'bg-[#C9CCCB] border-gray-400' 
                      : 'bg-[#D6E4F0] border-[#3470B9]' 
                  }`}
                >
                  {/* Icon Notifikasi */}
                  <div className={`p-2.5 rounded-full flex-shrink-0 flex items-center justify-center ${
                    notif.isRead ? 'bg-gray-400 text-gray-700' : 'bg-[#3470B9] text-white'
                  }`}>
                    {notif.type === 'pengajuan' ? <FileText size={18} /> : <Info size={18} />}
                  </div>

                  {/* Teks Pesan Notifikasi */}
                  <div className="flex-1 text-[13.5px] leading-snug">
                    {renderMessageText(notif)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm font-medium">
                Tidak ada notifikasi saat ini.
              </div>
            )}
          </div>

          {/* Footer Dropdown */}
          <div className="bg-[#EAECEF] py-3 text-center border-t border-gray-300 relative z-10">
            <Link 
                to={settingPath} 
                state={{ activeTab: 'notifikasi' }} 
                className="text-[#3470B9] text-[14.5px] font-medium hover:underline"
            >
                Lihat Semua Riwayat
            </Link>
           </div>

        </div>
      )}

      {/* Styling Kustom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}} />
    </div>
  );
}