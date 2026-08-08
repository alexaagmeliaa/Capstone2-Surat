import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import dummyData from '../../data/dummy.json'; 
import { Bell, FileText, Info, Check } from 'lucide-react';

export default function Settings() {
  const location = useLocation();
  
  // Mengatur tab default. Jika ada 'state' dari router (dari klik di dropdown), pakai tab itu.
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profil');

  // Menangkap perubahan jika user klik link dari dropdown saat sudah berada di halaman ini
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Mengambil data admin & notifikasi dari JSON
  const adminData = dummyData.admin || {};
  const formattedName = adminData.username ? adminData.username.charAt(0).toUpperCase() + adminData.username.slice(1) : 'Admin';
  
  // Memasukkan data notifikasi dummy ke dalam state agar bisa diubah status Read/Unread-nya
  const [notifications, setNotifications] = useState(dummyData.notifikasi || []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="setting" />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        <h2 className="text-[44px] font-semibold text-[#2A60A4] mb-8">Settings</h2>

        <div className="max-w-5xl">
          
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
          <div className="bg-[#F4F5F7] border border-gray-600 rounded-b-[12px] rounded-tr-[12px] p-10 shadow-sm relative min-h-[500px]">
            
            {/* --- ISI TAB PROFIL --- */}
            {activeTab === 'profil' && (
              <div className="flex flex-col md:flex-row gap-12 animate-fade-in">
                <div className="w-full md:w-[30%] flex flex-col items-center gap-6 pt-2">
                  <div className="w-56 h-56 rounded-full overflow-hidden border-[3px] border-[#3470B9] shadow-sm bg-white">
                    {/* Menggunakan gambar dinamis dari JSON dengan fallback */}
                    <img 
                      src={adminData.img || "/assets/profile/default.png"} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <button className="bg-[#3470B9] text-white px-5 py-3 rounded-[8px] text-[15px] font-medium hover:bg-[#285a96] transition-colors w-full shadow-sm">
                    Upload atau Drag&Drop
                  </button>
                </div>

                <div className="w-full md:w-[70%] space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Nama</label>
                      <input 
                        type="text" 
                        defaultValue={formattedName}
                        className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] focus:ring-1 focus:ring-[#3470B9]"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Email</label>
                      <input 
                        type="email" 
                        defaultValue={adminData.email}
                        className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] focus:ring-1 focus:ring-[#3470B9]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-800 mb-2">Password Lama</label>
                    <input type="password" className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9]" />
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-800 mb-2">Password Baru</label>
                    <input type="password" className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9]" />
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-gray-800 mb-2">Konfirmasi Password</label>
                    <input type="password" className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9]" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button className="bg-[#3470B9] text-white px-8 py-3 rounded-[8px] font-medium text-[15px] hover:bg-[#285a96] transition-colors shadow-sm">
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- ISI TAB NOTIFIKASI WEB (FULL VIEW) --- */}
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