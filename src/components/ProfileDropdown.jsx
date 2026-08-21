import React, { useState, useEffect, useRef } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { getUserAvatar } from '../utils/avatar';

export default function ProfileDropdown({ role = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 1. BACA STATE SECARA SINKRON: Agar tidak ada delay/flicker saat pindah halaman
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('cached_user_data');
    return cached ? JSON.parse(cached) : {};
  });

  const [uid, setUid] = useState(() => {
    const cached = localStorage.getItem('cached_user_data');
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.id || parsed.email || (role === 'admin' ? 'admin_user' : 'guest');
    }
    return role === 'admin' ? 'admin_user' : 'guest';
  });

  const [profileImg, setProfileImg] = useState(() => {
    // Cari UID terlebih dahulu secara langsung
    let initialUid = role === 'admin' ? 'admin_user' : 'guest';
    const cached = localStorage.getItem('cached_user_data');
    if (cached) {
      const parsed = JSON.parse(cached);
      initialUid = parsed.id || parsed.email || initialUid;
    }
    // Langsung tembak foto dari local storage tanpa nunggu API
    const saved = localStorage.getItem(`profile_img_${initialUid}`);
    return (saved && saved !== "null" && saved !== "undefined") ? saved : null;
  });

  // 2. FETCH API SILENT UPDATE: Tetap ambil data terbaru di background tanpa mengganggu UI
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      let currentUid = role === 'admin' ? 'admin_user' : 'guest';
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        currentUid = data.id || data.email || currentUid;
        setUid(currentUid);
        
        // Simpan cache agar load berikutnya instan!
        localStorage.setItem('cached_user_data', JSON.stringify(data));
      }

      const savedImg = localStorage.getItem(`profile_img_${currentUid}`);
      if (savedImg && savedImg !== "null" && savedImg !== "undefined") {
        setProfileImg(savedImg);
      }
    } catch (error) {
      console.error("Gagal memuat profil dropdown:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [role]);

  // 3. TANGKAP EVENT TANPA API: Kalau foto diganti, langsung render instan!
  useEffect(() => {
    const handleImageUpdate = () => {
      const savedImg = localStorage.getItem(`profile_img_${uid}`);
      if (savedImg && savedImg !== "null" && savedImg !== "undefined") {
        setProfileImg(savedImg);
      }
    };

    window.addEventListener('profileImageUpdated', handleImageUpdate);
    return () => {
      window.removeEventListener('profileImageUpdated', handleImageUpdate);
    };
  }, [uid]);

  const formattedName = user?.name 
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1) 
    : (role === 'admin' ? 'Administrator' : 'Mahasiswa');

  // Pakai foto profil yang disimpan, ATAU inisial dinamis
  const avatarSrc = profileImg || getUserAvatar(user);

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
    localStorage.removeItem('cached_user_data'); // Hapus cache saat logout
    navigate('/login');
  };

  const settingPath = role === 'mahasiswa' ? '/mhs/setting' : '/ad/setting';

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Tombol Profile / Trigger Dropdown */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border-2 border-[#3470B9] hover:border-[#285a96] transition-all focus:outline-none rounded-full outline-none shadow-sm overflow-hidden"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden flex justify-center items-center bg-[#D1D5DB]">
          <img 
            src={avatarSrc} 
            alt={formattedName} 
            className="w-full h-full object-cover"
          />
        </div>
      </button>

      {/* Kotak Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[280px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          
          <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-50 rotate-45 border-t border-l border-gray-200 z-0"></div>

          {/* Header Profil Singkat */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#3470B9] overflow-hidden bg-[#D1D5DB] flex-shrink-0 flex justify-center items-center">
                <img 
                  src={avatarSrc} 
                  alt={formattedName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <div className="text-[15px] font-bold text-[#182D4A] truncate">
                  {formattedName}
                </div>
                <div className="text-[13px] font-medium text-gray-500 truncate">
                  {user?.email || (role === 'admin' ? 'admin@stmik.ac.id' : '-')}
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