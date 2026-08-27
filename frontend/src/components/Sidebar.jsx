import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { 
  Home, 
  FileSignature, 
  FileSearch, 
  Users, 
  Settings, 
  LogOut,
  FilePlus,
  History
} from 'lucide-react';

export default function Sidebar({ activeMenu, role = 'admin' }) {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ==========================================
  // 1. DAFTAR MENU ADMIN 
  // (ID disesuaikan dengan activeMenu di halaman admin)
  // ==========================================
  const adminMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={24} strokeWidth={1.5} />, href: '/ad/dashboard' },
    { id: 'kelola-surat', label: 'Kelola Surat', icon: <FileSignature size={24} strokeWidth={1.5} />, href: '/ad/pengajuan' }, // Diubah ke 'kelola-surat' agar sinkron
    { id: 'kategori', label: 'Kategori', icon: <FileSearch size={24} strokeWidth={1.5} />, href: '/ad/kategori' },
    { id: 'mahasiswa', label: 'Data Mahasiswa', icon: <Users size={24} strokeWidth={1.5} />, href: '/ad/mahasiswa' },
    { id: 'setting', label: 'Setting', icon: <Settings size={24} strokeWidth={1.5} />, href: '/ad/setting' },
  ];

  // ==========================================
  // 2. DAFTAR MENU MAHASISWA
  // ==========================================
  const mahasiswaMenus = [
    { id: 'dashboard', label: 'Beranda', icon: <Home size={24} strokeWidth={1.5} />, href: '/mhs/dashboard' },
    { id: 'ajukan', label: 'Pengajuan Surat', icon: <FilePlus size={24} strokeWidth={1.5} />, href: '/mhs/ajukan' },
    { id: 'riwayat', label: 'Riwayat Pengajuan', icon: <History size={24} strokeWidth={1.5} />, href: '/mhs/riwayat' },
    { id: 'setting', label: 'Profil Saya', icon: <Settings size={24} strokeWidth={1.5} />, href: '/mhs/setting' },
  ];

  // Menentukan menu mana yang akan dirender berdasarkan role user
  const menus = role === 'mahasiswa' ? mahasiswaMenus : adminMenus;

  // Eksekusi fungsi logout
  const confirmLogout = () => {
    navigate('/');
  };

  return (
    <aside className="w-[250px] bg-gelap rounded-tr-[25px] rounded-tl-[25px] flex flex-col text-putih shadow-2xl z-20 sticky top-6 ml-6 mt-6">
      
      {/* Header / Logo Brand */}
      <div className="pt-12 pb-8 px-10 flex justify-center">
        <h1 className="text-[24px] font-bold tracking-wide text-putih">Letterly</h1>
      </div>
      
      {/* Navigasi Menu Sidebar */}
      <nav className="px-6 space-y-3 mt-6">
        {menus.map((menu) => {
          // Pengecekan apakah menu saat ini sedang aktif (sesuai halaman yang dibuka)
          const isActive = activeMenu === menu.id;
          return (
            <a 
              key={menu.id}
              href={menu.href} 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-putih font-semibold shadow-inner' // Style kotak aktif (highlight)
                  : 'text-putih/80 hover:text-putih hover:bg-white/10 font-light'
              }`}
            >
              <div className={isActive ? 'text-putih' : 'text-putih/80'}>
                {menu.icon}
              </div>
              <span className="text-[18px] tracking-wide">{menu.label}</span>
            </a>
          );
        })}
      </nav>
      
      {/* Footer / Tombol Logout */}
      <div className="p-8 mt-auto">
        <button 
          onClick={() => setIsLogoutModalOpen(true)} 
          className="flex items-center gap-4 px-4 py-3 w-full text-putih/80 hover:text-putih hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
        >
          <LogOut size={24} strokeWidth={1.5} />
          <span className="text-[18px] font-light tracking-wide">Logout</span>
        </button>
      </div>

      {/* Modal Konfirmasi Logout */}
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        message="Apakah anda yakin ingin keluar dari sistem?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="logout"
      />
      
    </aside>
  );
}