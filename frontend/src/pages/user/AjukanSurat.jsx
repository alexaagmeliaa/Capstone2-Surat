import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import ConfirmModal from '../../components/ConfirmModal';
import { UploadCloud, Send, AlertCircle, FileType, CheckCircle, Building2 } from 'lucide-react';

export default function AjukanSurat() {
  // --- 1. STATE MANAGEMENT (Menyimpan data komponen) ---
  const [currentUser, setCurrentUser] = useState({ name: '', nim: '' }); 
  const [jenisSuratList, setJenisSuratList] = useState([]); 
  const [jenisSurat, setJenisSurat] = useState(''); 
  const [tujuanSurat, setTujuanSurat] = useState(''); 
  const [keperluan, setKeperluan] = useState(''); 
  const [fileName, setFileName] = useState(''); 

  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    type: 'info',
    message: '',
    showCancel: false,
    confirmText: 'OK'
  });

  // --- 2. AMBIL DATA USER & KATEGORI SURAT DARI BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      try {
        const resUser = await fetch('http://localhost:8000/api/user', { headers });
        if (resUser.ok) {
          const jsonUser = await resUser.json();
          const userData = jsonUser.data || jsonUser;
          setCurrentUser({
            name: userData.name || '',
            nim: userData.nim || userData.email || ''
          });
        }

        const resKategori = await fetch('http://localhost:8000/api/kategori-surat', { headers });
        if (resKategori.ok) {
          const katData = await resKategori.json();
          if (katData.success) {
            const activeKategori = (katData.data || []).filter(kat => kat.status === 1 || kat.status === true);
            setJenisSuratList(activeKategori);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };

    fetchData();
  }, []);

  const showNotification = (message, type = 'warning') => {
    setPopupModal({
      isOpen: true,
      type,
      message,
      showCancel: false,
      confirmText: 'OK'
    });
  };

  // --- 4. HANDLE DRAG & DROP FILE LAMPIRAN ---
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
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
      setFileName(e.dataTransfer.files[0].name);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  // --- 5. FUNGSI KIRIM (SUBMIT) PENGAJUAN SURAT KE BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jenisSurat || !keperluan) {
      showNotification("Harap lengkapi jenis surat dan keperluan pengajuan!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append('jenis_surat', jenisSurat);
    
    if (tujuanSurat) {
      formData.append('tujuan_surat', tujuanSurat); 
    }
    
    formData.append('keperluan', keperluan);
    
    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append('lampiran', file);
    }

    try {
      const response = await fetch('http://localhost:8000/api/mahasiswa/surat', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(`Pengajuan "${jenisSurat}" berhasil dikirim ke Admin!\nSilakan pantau status surat di menu Riwayat.`, "success");
        setJenisSurat('');
        setTujuanSurat(''); 
        setKeperluan('');
        setFileName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        showNotification(data.message || "Terjadi kesalahan saat mengirim data ke server.", "danger");
      }

    } catch (error) {
      console.error("Error:", error);
      showNotification("Gagal terhubung ke server backend! Pastikan backend menyala.", "danger");
    }
  };

  // Mencari catatan dari kategori surat yang sedang dipilih saat ini
  const selectedKategoriData = jenisSuratList.find(kat => kat.nama_kategori === jenisSurat);

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="ajukan" role="mahasiswa" />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Pengajuan Surat</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Lengkapi formulir di bawah ini untuk mengajukan permohonan surat baru.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown role="mahasiswa" />
              <ProfileDropdown role="mahasiswa" user={currentUser} />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        <div className="max-w-4xl bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
          
          <div className="bg-blue-50 border-l-[6px] border-[#2A60A4] p-5 flex items-start gap-4">
            <AlertCircle className="text-[#2A60A4] flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="text-[#182D4A] font-bold text-[15px]">Informasi Penting</h4>
              <p className="text-[#2A60A4] text-[14px] mt-1">
                Kolom Instansi/Perusahaan dan Lampiran berkas bersifat <b>opsional</b>. Isi jika jenis surat yang diajukan memang ditujukan ke pihak luar atau membutuhkan berkas persyaratan.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            {/* Bagian 1: Data Pemohon */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Data Pemohon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={currentUser.name || 'Memuat data...'} 
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-[10px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Nomor Induk Mahasiswa (NIM)</label>
                  <input 
                    type="text" 
                    value={currentUser.nim || currentUser.email || 'Memuat data...'} 
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-[10px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium select-none"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 2: Detail Pengajuan Surat */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Detail Pengajuan Surat</h3>
              
              <div className="space-y-6">
                {/* Dropdown Kategori Surat */}
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Pilih Jenis Surat <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required
                      value={jenisSurat}
                      onChange={(e) => setJenisSurat(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] appearance-none font-medium transition-colors cursor-pointer"
                    >
                      <option value="" disabled>-- Pilih Kategori Surat --</option>
                      {jenisSuratList.map((kat) => (
                        <option key={kat.id} value={kat.nama_kategori}>
                          {kat.kode_kategori ? `[${kat.kode_kategori}] ` : ''}{kat.nama_kategori}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                      <FileType size={20} />
                    </div>
                  </div>

                  {/* TAMBAHAN: Alert Dinamis untuk Syarat Lampiran */}
                  {selectedKategoriData && selectedKategoriData.catatan && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-[10px] flex items-start gap-3 transition-all duration-300">
                      <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <span className="block text-[13.5px] font-bold text-amber-900 mb-0.5">Syarat Lampiran Khusus:</span>
                        <p className="text-[13.5px] text-amber-800 leading-relaxed font-medium">
                          {selectedKategoriData.catatan}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- INPUT INSTANSI / PERUSAHAAN (OPSIONAL) --- */}
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                    Ditujukan Kepada <span className="text-sm font-normal text-gray-500">(Opsional, isi jika diperlukan)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={tujuanSurat}
                      onChange={(e) => setTujuanSurat(e.target.value)}
                      placeholder="Contoh: PT. Telkom Indonesia / Dinas Pendidikan..."
                      className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 pl-11 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium transition-colors"
                    />
                    <div className="absolute left-3.5 top-3.5 text-gray-400">
                      <Building2 size={20} />
                    </div>
                  </div>
                </div>

                {/* Textarea Keperluan Pengajuan */}
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Keperluan Pengajuan <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    placeholder="Contoh: Digunakan untuk persyaratan pembuatan BPJS Kesehatan..."
                    rows="4"
                    className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] resize-none font-medium transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bagian 3: Unggah Lampiran Berkas (Opsional) */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">
                Lampiran Berkas <span className="text-sm font-normal text-gray-500">(Opsional)</span>
              </h3>
              
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`w-full relative border-2 border-dashed rounded-[16px] transition-all group ${
                  isDragging 
                    ? 'border-[#2A60A4] bg-blue-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-[#2A60A4]'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf, .jpg, .jpeg, .png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className={`w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 transition-transform ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {fileName ? (
                      <CheckCircle className="text-[#429961]" size={32} />
                    ) : (
                      <UploadCloud className="text-[#2A60A4]" size={32} />
                    )}
                  </div>
                  
                  {fileName ? (
                    <>
                      <div className="text-[#429961] font-bold text-[17px] mb-1">{fileName}</div>
                      <p className="text-[14px] text-gray-500">Klik atau timpa file untuk mengganti berkas</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[16px] font-bold text-gray-700 mb-1">
                        {isDragging ? 'Lepaskan file di sini' : 'Tarik & Lepas file di sini'}
                      </p>
                      <p className="text-[14px] text-gray-500">atau klik untuk menelusuri komputer Anda</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi Batal & Kirim */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Link 
                to="/mhs/dashboard" 
                className="px-6 py-3 rounded-[10px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-8 py-3 rounded-[10px] font-bold text-white bg-[#2A60A4] hover:bg-[#1f4b82] transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <Send size={18} strokeWidth={2.5} />
                Kirim Pengajuan
              </button>
            </div>

          </form>
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

    </div>
  );
}