import React, { useState, useRef, useEffect } from 'react';
import { Bell, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import dummyData from '../data/dummy.json';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mengambil data notifikasi dari JSON ke dalam state
  const [notifications, setNotifications] = useState(dummyData.notifikasi || []);

  // Menghitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  // Fungsi untuk menutup dropdown kalau user klik di luar kotak
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fungsi menandai semua sudah dibaca
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Tombol Lonceng (Bell) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 flex items-center justify-center rounded-full border-[1.5px] border-[#2A60A4] text-[#2A60A4] bg-[#F4F5F7] hover:bg-blue-50 transition-colors"
      >
        {/* Fill currentColor akan membuat ikonnya padat (solid) */}
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
          <div className="p-4 flex flex-col gap-3 max-h-[350px] overflow-y-auto bg-[#F4F5F7] relative z-10">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-[16px] border flex gap-4 items-center transition-colors ${
                    notif.isRead 
                      ? 'bg-[#C9CCCB] border-gray-400' // State Read (Abu-abu seperti di desain)
                      : 'bg-[#D6E4F0] border-[#3470B9]' // State Unread (Biru terang seperti di desain)
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
                    <span className={`font-semibold ${notif.isRead ? 'text-gray-800' : 'text-black'}`}>
                      {notif.message.split('mengajukan Surat')[0]} {/* Ambil nama & NIM */}
                    </span>
                    {notif.message.includes('mengajukan Surat') && (
                      <span className={notif.isRead ? 'text-gray-700' : 'text-gray-800'}>
                        mengajukan Surat{' '}
                      </span>
                    )}
                    {notif.type === 'sistem' && (
                      <span className={notif.isRead ? 'text-gray-700' : 'text-gray-800'}>
                        {notif.message}{' '}
                      </span>
                    )}
                    <span className={`font-bold ${notif.isRead ? 'text-gray-800' : 'text-black'}`}>
                      {notif.time}.
                    </span>
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
            {/* Tambahkan state di sini untuk memberi tahu halaman tujuan */}
            <Link 
                to="/ad/setting" 
                state={{ activeTab: 'notifikasi' }} 
                className="text-[#3470B9] text-[14.5px] font-medium hover:underline"
            >
                Lihat Semuanya
            </Link>
           </div>

        </div>
      )}
    </div>
  );
}