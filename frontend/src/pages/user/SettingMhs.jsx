import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ConfirmModal from '../../components/ConfirmModal';
import dummyData from '../../data/dummy.json'; 
import { FileText, Info, Check, UploadCloud } from 'lucide-react';

export default function SettingMhs() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profil');

  // State data profil dari database
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Tarik data user asli dari database & cek localStorage untuk foto profil tersimpan
  useEffect(() => {
    const fetchUserProfile = async () => {
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

          // Ambil foto dari localStorage jika sudah disimpan permanen
          const savedImg = localStorage.getItem('profile_img');
          setFormData(prev => ({
            ...prev,
            img: savedImg || data.img || "/assets/profile/default.png"
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const formattedName = user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Mahasiswa';
  
  // --- STATE UTAMA (FOTO & PASSWORD) ---
  const [formData, setFormData] = useState({
    img: "/assets/profile/default.png",
    tempImg: null, // Menyimpan file gambar sementara sebelum diklik "Simpan Perubahan"
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State untuk Popup Modal
  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    type: 'info',
    message: '',
    showCancel: false,
    confirmText: 'OK'
  });

  const showNotification = (message, type = 'warning') => {
    setPopupModal({
      isOpen: true,
      type,
      message,
      showCancel: false,
      confirmText: 'OK'
    });
  };

  // State untuk Drag & Drop
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Notifikasi
  const [notifications, setNotifications] = useState(dummyData.notifikasi || []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  // --- FUNGSI DRAG & DROP FOTO (TANPA POPUP NOTIFIKASI) ---
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      
      // Simpan sementara di state form & simpan file aslinya ke tempImg
      setFormData(prev => ({ 
        ...prev, 
        img: imageUrl,
        tempImg: imageUrl 
      }));
    } else {
      showNotification("Tolong upload file gambar (JPG/PNG) ya!", "warning");
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // --- FUNGSI SIMPAN PERUBAHAN (BARU MUNCUL NOTIF & TERSIMPAN PERMANEN) ---
  const handleSaveAll = (e) => {
    e.preventDefault();

    const isChangingPassword = formData.oldPassword || formData.newPassword || formData.confirmPassword;

    if (isChangingPassword) {
      if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
        showNotification("Harap lengkapi semua kolom password jika ingin mengubah password!", "warning");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        showNotification("Konfirmasi password baru tidak cocok!", "warning");
        return;
      }
    }

    // Jika user mengganti foto profil, simpan permanen ke localStorage saat tombol Simpan ditekan
    if (formData.tempImg) {
      localStorage.setItem('profile_img', formData.tempImg);
      window.dispatchEvent(new Event('profileImageUpdated'));
    }

    let successMessage = "Perubahan berhasil disimpan!\n";
    successMessage += `- Foto Profil berhasil diperbarui.\n`;
    if (isChangingPassword) {
      successMessage += `- Password akun berhasil diubah.`;
    }

    showNotification(successMessage, "success");

    setFormData(prev => ({
      ...prev,
      tempImg: null,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="setting" role="mahasiswa" />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Profil Saya</h2>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <span className="text-gray-700 font-medium text-[15px]">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
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
              <form onSubmit={handleSaveAll} className="flex flex-col lg:flex-row gap-12 animate-fade-in">
                
                {/* KIRI: Foto & Drag Drop */}
                <div className="w-full lg:w-[30%] flex flex-col items-center pt-2">
                  
                  {/* Area Drag & Drop Foto */}
                  <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`relative w-48 h-48 rounded-full overflow-hidden border-[3px] border-[#3470B9] shadow-sm mb-6 flex justify-center items-center group cursor-pointer transition-all ${
                      isDragging ? 'bg-[#E8F5EB]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    {formData.img === "/assets/profile/default.png" || !formData.img ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#D1D5DB] relative">
                        <div className="w-20 h-20 rounded-full bg-[#8A939B] mb-2"></div>
                        <div className="w-32 h-16 rounded-t-full bg-[#8A939B]"></div>
                      </div>
                    ) : (
                      <img 
                        src={formData.img} 
                        alt="Profile" 
                        className={`w-full h-full object-cover transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'}`} 
                      />
                    )}
                    
                    {/* Overlay saat di hover atau saat dragging */}
                    <div className={`absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <UploadCloud color="white" size={32} className="mb-2" />
                      <span className="text-white text-[13px] font-semibold text-center px-4">
                        {isDragging ? 'Lepaskan Foto' : 'Klik atau Drag & Drop Foto Baru'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Input File Tersembunyi */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFile(e.target.files[0])} 
                  />

                  <div className="text-center mb-6">
                    <h3 className="text-[22px] font-bold text-[#182D4A] leading-tight">
                      {isLoading ? "Memuat..." : formattedName}
                    </h3>
                    <p className="text-[15px] font-semibold text-[#2A60A4] mt-1">
                      {user.prodi || 'S1 - Teknik Informatika'}
                    </p>
                  </div>
                  
                  {/* Tombol pemicu file upload manual */}
                  <button type="button" onClick={() => fileInputRef.current.click()} className="bg-[#3470B9] text-white px-5 py-3 rounded-[8px] text-[15px] font-medium hover:bg-[#285a96] transition-colors w-full shadow-sm">
                    Upload Foto Baru
                  </button>
                </div>

                {/* KANAN: Form Informasi Pribadi */}
                <div className="w-full lg:w-[70%]">
                  <h4 className="text-[18px] font-bold text-[#182D4A] border-b border-gray-300 pb-2 mb-6">Informasi Pribadi</h4>
                  
                  {/* Grid Form Terkunci */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    
                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Nama Lengkap</label>
                      <input type="text" value={user.name || ''} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Nomor Induk Mahasiswa (NIM)</label>
                      <input type="text" value={user.nim || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>
                    
                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Email Kampus</label>
                      <input type="email" value={user.email || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Status Mahasiswa</label>
                      <input type="text" value={user.status || 'Aktif'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 cursor-not-allowed font-bold text-green-700 select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Angkatan</label>
                      <input type="text" value={user.angkatan || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Jenis Mahasiswa</label>
                      <input type="text" value={user.jenis_mhs || 'Regular'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Jenis Kelamin</label>
                      <input type="text" value={user.jenis_kelamin || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Dosen Wali</label>
                      <input type="text" value={user.dosen_wali || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div>
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Tempat, Tanggal Lahir</label>
                      <input type="text" value={user.ttl || '-'} disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[15px] font-semibold text-gray-800 mb-2">Alamat Lengkap</label>
                      <textarea value={user.alamat || '-'} rows="3" disabled className="w-full bg-[#D1D5DB] border border-gray-400 rounded-[8px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium resize-none select-none"></textarea>
                    </div>

                  </div>

                  {/* Form Ganti Password */}
                  <div className="pt-8 mt-8 border-t border-gray-300">
                    <h4 className="text-[18px] font-bold text-[#182D4A] mb-5">Ubah Keamanan Akun</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[15px] font-semibold text-gray-800 mb-2">Password Lama</label>
                        <input 
                          type="password" 
                          value={formData.oldPassword}
                          onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                          placeholder="Masukkan password saat ini..." 
                          className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] transition-all" 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[15px] font-semibold text-gray-800 mb-2">Password Baru</label>
                          <input 
                            type="password" 
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            placeholder="Buat password baru..." 
                            className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] transition-all" 
                          />
                        </div>
                        <div>
                          <label className="block text-[15px] font-semibold text-gray-800 mb-2">Konfirmasi Password Baru</label>
                          <input 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            placeholder="Ulangi password baru..." 
                            className="w-full bg-[#C9CCCB] border border-gray-600 rounded-[8px] px-4 py-3 text-gray-800 outline-none focus:border-[#3470B9] transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tombol Simpan Perubahan */}
                    <div className="flex justify-end pt-8">
                      <button type="submit" className="bg-[#3470B9] text-white px-8 py-3 rounded-[8px] font-medium text-[15px] hover:bg-[#285a96] transition-colors shadow-sm">
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>

                </div>
              </form>
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

      <ConfirmModal 
        isOpen={popupModal.isOpen}
        onClose={() => setPopupModal(prev => ({ ...prev, isOpen: false }))}
        message={popupModal.message}
        type={popupModal.type}
        showCancel={popupModal.showCancel}
        confirmText={popupModal.confirmText}
      />

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