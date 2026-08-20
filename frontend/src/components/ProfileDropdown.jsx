import React, { useState, useEffect, useRef } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

export default function ProfileDropdown({ role = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Gagal memuat profil dropdown:", error);
    }

    const savedImg = localStorage.getItem('profile_img');
    if (savedImg && savedImg !== "null" && savedImg !== "undefined") {
      setProfileImg(savedImg);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleImageUpdate = () => {
      const savedImg = localStorage.getItem('profile_img');
      if (savedImg) {
        setProfileImg(savedImg);
      }
    };

    window.addEventListener('profileImageUpdated', handleImageUpdate);
    return () => {
      window.removeEventListener('profileImageUpdated', handleImageUpdate);
    };
  }, []);

  const formattedName = user?.name 
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1) 
    : 'Pengguna';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('profile_img');
    navigate('/login');
  };

  const settingPath = role === 'mahasiswa' ? '/mhs/setting' : '/ad/setting';

  // Helper komponen untuk menampilkan siluet abu-abu yang rapi
  const renderDefaultAvatar = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#D1D5DB] relative overflow-hidden">
      <div className="w-5 h-5 rounded-full bg-[#8A939B] mb-0.5"></div>
      <div className="w-8 h-4 rounded-t-full bg-[#8A939B]"></div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Tombol Profile / Trigger Dropdown */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border-2 border-[#3470B9] hover:border-[#285a96] transition-colors focus:outline-none rounded-full outline-none shadow-sm overflow-hidden"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex justify-center items-center bg-[#D1D5DB]">
          {profileImg ? (
            <img 
              src={profileImg} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={() => setProfileImg(null)} // Jika gambar gagal dimuat, otomatis kembali ke siluet
            />
          ) : (
            renderDefaultAvatar()
          )}
        </div>
      </button>

      {/* Kotak Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[280px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          
          <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-50 rotate-45 border-t border-l border-gray-200 z-0"></div>

          {/* Header Profil Singkat */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#3470B9] overflow-hidden bg-[#D1D5DB] flex-shrink-0 flex flex-col justify-center items-center">
                {profileImg ? (
                  <img 
                    src={profileImg} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={() => setProfileImg(null)}
                  />
                ) : (
                  renderDefaultAvatar()
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-[15px] font-bold text-[#182D4A] truncate">
                  {formattedName}
                </div>
                <div className="text-[13px] font-medium text-gray-500 truncate">
                  {user?.email || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* List Menu */}
          <div className="p-2 space-y-1 relative z-10 bg-white">
            <Link 
              to={settingPath} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#2A60A4] rounded-lg transition-colors"
            >
              <Settings size={18} />
              Pengaturan Akun
            </Link>
          </div>

          {/* Tombol Logout */}
          <div className="p-2 border-t border-gray-100 relative z-10 bg-white">
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>

        </div>
      )}

      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        message="Apakah anda yakin ingin keluar dari sistem?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="logout"
      />
    </div>
  );
}