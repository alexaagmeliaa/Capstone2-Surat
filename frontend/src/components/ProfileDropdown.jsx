import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import dummyData from '../data/dummy.json'; // Pastikan path ini sesuai dengan struktur folder kamu

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mengambil data admin dari dummy.json
  const adminData = dummyData.admin;
  
  // Membuat inisial dari username (misal: "admin" -> "A")
  const initial = adminData.username ? adminData.username.charAt(0).toUpperCase() : 'A';

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Profile / Trigger Dropdown */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border-2 border-biru focus:outline-none rounded-full outline-none shadow-sm"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center">
            <img 
                src={adminData.img || "/assets/profile/default.png"} 
                alt="Avatar" 
                className="w-full h-full object-cover"
            />
        </div>
      </button>

      {/* Kotak Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          
          {/* Header Profil Singkat */}
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-biru overflow-hidden bg-biru flex items-center justify-center text-white font-bold text-lg">
                <img 
                    src={adminData.img || "/assets/profile/default.png"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-[#182D4A] capitalize">{adminData.username}</div>
                <div className="text-xs font-medium text-gray-500 truncate max-w-[150px]">
                  {adminData.email}
                </div>
              </div>
            </div>
          </div>

          {/* List Menu */}
          <div className="p-2 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#2A60A4] rounded-lg transition-colors">
              <User size={18} />
              Profil Saya
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#2A60A4] rounded-lg transition-colors">
              <Settings size={18} />
              Pengaturan Akun
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#2A60A4] rounded-lg transition-colors">
              <HelpCircle size={18} />
              Bantuan & FAQ
            </a>
          </div>

          {/* Tombol Logout */}
          <div className="p-2 border-t border-gray-200">
            <button className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
              <LogOut size={18} />
              Keluar Sistem
            </button>
          </div>

        </div>
      )}
    </div>
  );
}