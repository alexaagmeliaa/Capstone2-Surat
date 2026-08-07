import React from 'react';
import { 
  Home, 
  FileSignature, 
  FileSearch, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ activeMenu }) {
  // Array menu untuk mempermudah render dan mengatur status aktif
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={24} strokeWidth={1.5} />, href: '/ad/dashboard' },
    { id: 'kelola', label: 'Kelola Surat', icon: <FileSignature size={24} strokeWidth={1.5} />, href: '/ad/pengajuan' },
    { id: 'kategori', label: 'Kategori', icon: <FileSearch size={24} strokeWidth={1.5} />, href: '/ad/kategori' },
    { id: 'mahasiswa', label: 'Data Mahasiswa', icon: <Users size={24} strokeWidth={1.5} />, href: '/ad/mahasiswa' },
    { id: 'setting', label: 'Setting', icon: <Settings size={24} strokeWidth={1.5} />, href: '/ad/setting' },
  ];

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
                  : 'text-putih/80 hover:text-putih hover:bg-putih/10 font-light'
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
      
      {/* Footer / Logout (mt-auto memaksa bagian ini turun ke paling bawah) */}
      <div className="p-8 mt-auto">
        <button className="flex items-center gap-4 px-4 py-3 w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
          <LogOut size={24} strokeWidth={1.5} />
          <span className="text-[18px] font-light tracking-wide">Logout</span>
        </button>
      </div>
      
    </aside>
  );
}