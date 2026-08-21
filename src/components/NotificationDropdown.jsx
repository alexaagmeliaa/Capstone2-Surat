import React, { useState, useRef, useEffect } from 'react';
import { Bell, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDropdown({ role = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State untuk menyimpan notifikasi asli dari Backend API
  const [notifications, setNotifications] = useState([]);

  // Ambil UID dari cache agar sinkron dan spesifik per orang
  const [uId, setUid] = useState(() => {
    const cached = localStorage.getItem('cached_user_data');
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.id || parsed.email || (role === 'admin' ? 'admin_user' : 'guest');
    }
    return role === 'admin' ? 'admin_user' : 'guest';
  });

  // Helper mengambil ID notifikasi yang dibaca dari LocalStorage
  const getReadNotifIds = (userId) => {
    try {
      const saved = localStorage.getItem(`read_notifs_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper waktu relatif (cth: "2 jam lalu")
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

  // Tarik data notifikasi dari Backend berdasarkan Role
  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Bedakan endpoint yang ditembak berdasarkan role
      const endpoint = role === 'admin' 
        ? 'http://localhost:8000/api/admin/surat' 
        : 'http://localhost:8000/api/mahasiswa/surat';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const arraySurat = Array.isArray(data) ? data : (data.data || []);
        
        const readIds = getReadNotifIds(uId);

        // Format data mentah dari backend menjadi bentuk notifikasi
        const formatted = arraySurat.map(surat => {
          const notifId = `${role}_surat_${surat.id}_${surat.status}`;
          const jenisSurat = surat.jenis_surat || surat.judul_surat || 'Surat Pengantar';
          const mhsName = surat.user?.name || 'Mahasiswa';
          const timeStr = getRelativeTime(surat.created_at || surat.updated_at);
          const isRead = readIds.includes(notifId);

          let message = '';
          let type = 'info';

          // Logika Pesan Khusus ADMIN
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
          } 
          // Logika Pesan Khusus MAHASISWA
          else {
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

        // Urutkan notifikasi dari yang paling baru
        formatted.sort((a, b) => b.timestamp - a.timestamp);

        setNotifications(formatted);
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    }
  };

  // Muat notifikasi saat komponen pertama kali dirender
  useEffect(() => {
    loadNotifications();
  }, [role, uId]);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fungsi menandai semua sudah dibaca & menyimpannya ke LocalStorage khusus UID ini
  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(`read_notifs_${uId}`, JSON.stringify(allIds));
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

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
      
      {/* Tombol Lonceng (Bell) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 flex items-center justify-center rounded-full border-[1.5px] border-[#2A60A4] text-[#2A60A4] bg-[#F4F5F7] hover:bg-blue-50 transition-colors focus:outline-none"
      >
        <Bell size={22} fill="currentColor" strokeWidth={1} />
        
        {/* Badge merah jika ada notifikasi belum dibaca */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Kotak Dropdown Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-[#F4F5F7] border border-gray-300 rounded-[16px] shadow-2xl z-50 overflow-hidden flex flex-col">
          
          {/* Segitiga kecil di atas (Tooltip Arrow) */}
          <div className="absolute -top-2 right-4 w-4 h-4 bg-[#EAECEF] rotate-45 border-t border-l border-gray-300 z-0"></div>

          {/* Header */}
          <div className="bg-[#EAECEF] px-5 py-4 flex justify-between items-center border-b border-gray-300 relative z-10">
            <h3 className="text-[15px] font-bold text-gray-800 tracking-wide">NOTIFIKASI</h3>
            <button 
              onClick={markAllAsRead}
              className="text-[#3470B9] text-[14px] font-medium hover:underline focus:outline-none"
            >
              Tandai semua dibaca
            </button>
          </div>

          {/* Body / List Notifikasi */}
          <div className="p-4 flex flex-col gap-3 max-h-[350px] overflow-y-auto bg-[#F4F5F7] relative z-10 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-[16px] border flex gap-4 items-center transition-colors ${
                    notif.isRead 
                      ? 'bg-[#C9CCCB] border-gray-400' // Read
                      : 'bg-[#D6E4F0] border-[#3470B9]' // Unread
                  }`}
                >
                  {/* Icon */}
                  <div className={`p-2.5 rounded-full flex-shrink-0 flex items-center justify-center ${
                    notif.isRead ? 'bg-gray-400 text-gray-700' : 'bg-[#3470B9] text-white'
                  }`}>
                    {notif.type === 'pengajuan' ? <FileText size={18} /> : <Info size={18} />}
                  </div>

                  {/* Teks Pesan */}
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

          {/* Footer */}
          <div className="bg-[#EAECEF] py-3 text-center border-t border-gray-300 relative z-10">
            {/* Tautan yang dinamis mengarah berdasarkan role */}
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

      {/* Tambahan style untuk mempercantik scrollbar */}
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