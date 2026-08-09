import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import dummyData from '../../data/dummy.json'; 
import { FileText, Info, Check } from 'lucide-react';

export default function SettingMhs() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profil');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const userData = dummyData.user || {};
  const formattedName = userData.username ? userData.username.charAt(0).toUpperCase() + userData.username.slice(1) : 'Mahasiswa';
  
  const [notifications, setNotifications] = useState(dummyData.notifikasi || []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="setting" role="mahasiswa" />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Profil Saya</h2>
          </div>
        </header>

        <div className="max-w-6xl">
          
          {/* Bagian Tabs */}
          <div className="flex items-end">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`px-12 py-3 border border-gray-600 rounded-t-[10px] relative transition-colors focus:outline-none ${
                activeTab === 'profil' 
                  ? 'bg-[#F4F5F7] border-b-0 text-gray-800 z-10 -mb-[1px]' 
                  : 'bg-[#EAECEF] border-b-gray-600 border-r-0 text-gray-500 hover:bg-[#E0E2E5] z-0'
              }`}
            >
              <span className="text-[17px] font-semibold">Profil</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('notifikasi')}
              className={`px-12 py-3 border border-gray-600 rounded-t-[10px] relative transition-colors focus:outline-none ${
                activeTab === 'notifikasi' 
                  ? 'bg-[#F4F5F7] border-b-0 text-gray-800 z-10 -mb-[1px]' 
                  : 'bg-[#EAECEF] border-b-gray-600 border-l-0 text-gray-500 hover:bg-[#E0E2E5] z-0'
              }`}
            >
              <span className="text-[17px] font-semibold">Notifikasi</span>
            </button>
          </div>

          {/* Kotak Utama Konten */}
          <div className="bg-[#F4F5F7] border border-gray-600 rounded-b-[12px] rounded-tr-[12px] p-8 md:p-10 shadow-sm relative min-h-[500px]">
            
            {/* --- ISI TAB PROFIL --- */}
            {activeTab === 'profil' && (
              <div className="flex flex-col lg:flex-row gap-12 animate-fade-in">
                
                {/* KIRI: Foto & Identitas Singkat */}
                <div className="w-full lg:w-[30%] flex flex-col items-center pt-2">
                  <div className="w-56 h-56 rounded-full overflow-hidden border-[4px] border-[#3470B9] shadow-sm bg-white mb-6">
                    <img 
                      src={userData.img || "/assets/profile/default.png"} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-[22px] font-bold text-[#182D4A] leading-tight">{formattedName}</h3>
                    <p className="text-[15px] font-semibold text-[#2A60A4] mt-1">{userData.prodi || 'S1 - Teknik Informatika'}</p>
                  </div>
                  {/* Tombol kembali ke warna Biru Solid */}
                  <button className="bg-[#3470B9] text-white px-5 py-3 rounded-[8px] text-[15px] font-medium hover:bg-[#285a96] transition-colors w-full shadow-sm">
                    Upload atau Drag&Drop
                  </button>
                </div>

                {/* KANAN: Form Informasi Pribadi */}
                <div className="w-full lg:w-[70%]">
                  <h4 className="text-[18px] font-bold text-[#182D4A] border-b border-gray-300 pb-2 mb-6">Informasi Pribadi</h4>
                  
                  {/* Grid Form Terkunci dengan Style Lama */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    
                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Nama Lengkap</label>
                      <input type="text" defaultValue={formattedName} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Nomor Induk Mahasiswa (NIM)</label>
                      <input type="text" defaultValue={userData.nim || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>
                    
                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Email Kampus</label>
                      <input type="email" defaultValue={userData.email || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Status Mahasiswa</label>
                      <input type="text" defaultValue={userData.status_aktif || 'Aktif'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 cursor-not-allowed font-bold text-green-700 select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Angkatan</label>
                      <input type="text" defaultValue={userData.angkatan || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Jenis Mahasiswa</label>
                      <input type="text" defaultValue={userData.jenis_mhs || 'Regular'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Jenis Kelamin</label>
                      <input type="text" defaultValue={userData.jenis_kelamin || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Dosen Wali</label>
                      <input type="text" defaultValue={userData.dosen_wali || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Tempat, Tanggal Lahir</label>
                      <input type="text" defaultValue={userData.ttl || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Alamat Lengkap</label>
                      <textarea defaultValue={userData.alamat || '-'} rows="3" disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium resize-none select-none"></textarea>
                    </div>

                  </div>

                  {/* Form Ganti Password (Bisa Diubah dengan Style Lama #C9CCCB) */}
                  <div className="pt-8 mt-6 border-t border-gray-300">
                    <h4 className="text-[18px] font-bold text-[#182D4A] mb-5">Ubah Keamanan Akun</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[15px] font-semibold text-gray-800 mb-2">Password Lama</label>
                        <input type="password" placeholder="Masukkan password saat ini..." className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] transition-all" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[15px] font-semibold text-gray-800 mb-2">Password Baru</label>
                          <input type="password" placeholder="Buat password baru..." className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] transition-all" />
                        </div>
                        <div>
                          <label className="block text-[15px] font-semibold text-gray-800 mb-2">Konfirmasi Password Baru</label>
                          <input type="password" placeholder="Ulangi password baru..." className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button className="bg-[#3470B9] text-white px-8 py-3 rounded-[8px] font-medium text-[15px] hover:bg-[#285a96] transition-colors shadow-sm">
                        Simpan Password Baru
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* --- ISI TAB NOTIFIKASI WEB --- */}
            {activeTab === 'notifikasi' && (
              <div className="animate-fade-in w-full">
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#182D4A]">Riwayat Aktivitas</h3>
                    <p className="text-[14px] text-gray-500 mt-1">Daftar semua notifikasi dan aktivitas terbaru di sistem.</p>
                  </div>
                  <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 text-[14px] font-semibold text-[#2A60A4] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors focus:outline-none"
                  >
                    <Check size={18} strokeWidth={2.5} />
                    Tandai semua dibaca
                  </button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-5 rounded-[12px] border transition-colors flex gap-5 items-start ${
                        notif.isRead 
                          ? 'bg-transparent border-gray-300'
                          : 'bg-[#E8F0FA] border-[#A8C7F0]'
                      }`}
                    >
                      <div className={`p-3 rounded-full flex-shrink-0 ${
                        notif.isRead ? 'bg-gray-200 text-gray-500' : 'bg-[#2A60A4] text-white'
                      }`}>
                        {notif.type === 'pengajuan' ? <FileText size={20} /> : <Info size={20} />}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-[16px] font-bold ${notif.isRead ? 'text-gray-700' : 'text-[#182D4A]'}`}>
                            {notif.title}
                          </h4>
                          <span className={`text-[13px] font-medium ${notif.isRead ? 'text-gray-500' : 'text-[#2A60A4]'}`}>
                            {notif.time}
                          </span>
                        </div>
                        <p className={`text-[14px] leading-relaxed ${notif.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}