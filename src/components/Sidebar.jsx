import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  const navigate = useNavigate(); // Inisialisasi fungsi navigasi

  // 1. Array menu khusus ADMIN
  const adminMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={24} strokeWidth={1.5} />, href: '/ad/dashboard' },
    { id: 'kelola', label: 'Kelola Surat', icon: <FileSignature size={24} strokeWidth={1.5} />, href: '/ad/pengajuan' },
    { id: 'kategori', label: 'Kategori', icon: <FileSearch size={24} strokeWidth={1.5} />, href: '/ad/kategori' },
    { id: 'mahasiswa', label: 'Data Mahasiswa', icon: <Users size={24} strokeWidth={1.5} />, href: '/ad/mahasiswa' },
    { id: 'setting', label: 'Setting', icon: <Settings size={24} strokeWidth={1.5} />, href: '/ad/setting' },
  ];

  // 2. Array menu khusus MAHASISWA
  const mahasiswaMenus = [
    { id: 'dashboard', label: 'Beranda', icon: <Home size={24} strokeWidth={1.5} />, href: '/user/dashboard' },
    { id: 'ajukan', label: 'Pengajuan Surat', icon: <FilePlus size={24} strokeWidth={1.5} />, href: '/user/ajukan' },
    { id: 'riwayat', label: 'Riwayat Pengajuan', icon: <History size={24} strokeWidth={1.5} />, href: '/user/riwayat' },
    { id: 'setting', label: 'Profil Saya', icon: <Settings size={24} strokeWidth={1.5} />, href: '/user/setting' },
  ];

  const menus = role === 'mahasiswa' ? mahasiswaMenus : adminMenus;

  // Fungsi untuk menangani proses Logout
  const handleLogout = () => {
    // Nanti kalau sudah pakai API/Backend, kamu bisa hapus token di sini
    // localStorage.removeItem('token');
    // sessionStorage.clear();

    // Arahkan kembali ke halaman Login (sesuaikan '/'-nya jika path login kamu berbeda)
    navigate('/');
  };

  return (
    <aside className="w-[250px] bg-gelap rounded-tr-[25px] rounded-tl-[25px] flex flex-col text-putih shadow-2xl z-20 sticky top-6 ml-6 mt-6">
      
      {/* Header / Logo */}
      <div className="pt-12 pb-8 px-10 flex justify-center">
        <h1 className="text-[24px] font-bold tracking-wide text-putih">E-Surat App</h1>
      </div>
      
      {/* Navigasi Menu */}
      <nav className="px-6 space-y-3 mt-6">
        {menus.map((menu) => {
          const isActive = activeMenu === menu.id;
          return (
            <a 
              key={menu.id}
              href={menu.href} 
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-putih font-semibold' 
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
      
      {/* Footer / Logout */}
      <div className="p-8 mt-auto">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-4 px-4 py-3 w-full text-putih/80 hover:text-putih hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
        >
          <LogOut size={24} strokeWidth={1.5} />
          <span className="text-[18px] font-light tracking-wide">Logout</span>
        </button>
      </div>
      
    </aside>
  );
}