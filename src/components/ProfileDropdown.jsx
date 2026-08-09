import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import dummyData from '../data/dummy.json';

// Tambahkan parameter "role" (default-nya "admin")
export default function ProfileDropdown({ role = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Menentukan data siapa yang ditarik berdasarkan role
  const profileData = role === 'mahasiswa' ? dummyData.user : dummyData.admin;
  
  // Format nama agar huruf depan selalu kapital (misal: "user" -> "User")
  const formattedName = profileData?.username 
    ? profileData.username.charAt(0).toUpperCase() + profileData.username.slice(1) 
    : 'Pengguna';

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

  // Fungsi Logout
  const handleLogout = () => {
    navigate('/');
  };

  // Tentukan rute halaman setting berdasarkan role
  const settingPath = role === 'mahasiswa' ? '/user/setting' : '/ad/setting';

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Tombol Profile / Trigger Dropdown */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border-2 border-[#3470B9] hover:border-[#285a96] transition-colors focus:outline-none rounded-full outline-none shadow-sm"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white">
          <img 
            src={profileData?.img || "/assets/profile/default.png"} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </button>

      {/* Kotak Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[280px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          
          {/* Segitiga kecil di atas (Tooltip Arrow) */}
          <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-50 rotate-45 border-t border-l border-gray-200 z-0"></div>

          {/* Header Profil Singkat */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#3470B9] overflow-hidden bg-white flex-shrink-0">
                <img 
                  src={profileData?.img || "/assets/profile/default.png"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <div className="text-[15px] font-bold text-[#182D4A] truncate">
                  {formattedName}
                </div>
                <div className="text-[13px] font-medium text-gray-500 truncate">
                  {profileData?.email}
                </div>
              </div>
            </div>
          </div>

          {/* List Menu */}
          <div className="p-2 space-y-1 relative z-10 bg-white">
            
            <Link 
              to={settingPath} 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#2A60A4] rounded-lg transition-colors"
            >
              <User size={18} />
              Profil Saya
            </Link>
            
            <Link 
              to={settingPath} 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#2A60A4] rounded-lg transition-colors"
            >
              <Settings size={18} />
              Pengaturan Akun
            </Link>
            
            <button className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#2A60A4] rounded-lg transition-colors">
              <HelpCircle size={18} />
              Bantuan & FAQ
            </button>
            
          </div>

          {/* Tombol Logout */}
          <div className="p-2 border-t border-gray-100 relative z-10 bg-white">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Keluar Sistem
            </button>
          </div>

        </div>
      )}
    </div>
  );
}