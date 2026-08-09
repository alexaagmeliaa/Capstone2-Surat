import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import dummyData from '../../data/dummy.json';
import { UploadCloud, Send, AlertCircle, FileType } from 'lucide-react';

export default function AjukanSurat() {
  // Ambil data user dari dummy.json untuk auto-fill form
  const userData = dummyData.user || {};
  const formattedName = userData.username ? userData.username.charAt(0).toUpperCase() + userData.username.slice(1) : 'Mahasiswa';

  // State untuk menyimpan input form
  const [jenisSurat, setJenisSurat] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [fileName, setFileName] = useState('');

  // Handle ketika file diupload
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  // Handle submit form (sementara hanya prevent default)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini nanti logika untuk POST data ke API Laravel kamu menggunakan Postman/Axios
    console.log("Data dikirim:", { jenisSurat, keperluan, fileName });
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Sidebar Aktif di menu 'ajukan' */}
      <Sidebar activeMenu="ajukan" role="mahasiswa" />

      {/* --- KONTEN UTAMA KANAN --- */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        
        {/* Header Atas */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Pengajuan Surat</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Lengkapi formulir di bawah ini untuk mengajukan permohonan surat baru.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <ProfileDropdown role='mahasiswa' />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">08 Agustus 2026</span>
          </div>
        </header>

        {/* --- FORM AREA --- */}
        <div className="max-w-4xl bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Alert Info Persyaratan */}
          <div className="bg-blue-50 border-l-[6px] border-[#2A60A4] p-5 flex items-start gap-4">
            <AlertCircle className="text-[#2A60A4] flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="text-[#182D4A] font-bold text-[15px]">Informasi Penting</h4>
              <p className="text-[#2A60A4] text-[14px] mt-1">
                Pastikan data diri dan lampiran berkas sudah sesuai dengan persyaratan jenis surat yang dipilih. Format berkas yang didukung: <b>PDF, JPG, PNG</b> (Maks 2MB).
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            {/* 1. Data Diri (Auto-fill & Read-only) */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Data Pemohon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={formattedName} 
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-[10px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Nomor Induk Mahasiswa (NIM)</label>
                  <input 
                    type="text" 
                    value={userData.nim || '10119099'} 
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-[10px] px-4 py-3 text-gray-600 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 2. Detail Pengajuan */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Detail Pengajuan Surat</h3>
              
              <div className="space-y-6">
                {/* Pilihan Jenis Surat */}
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Pilih Jenis Surat <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required
                      value={jenisSurat}
                      onChange={(e) => setJenisSurat(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] appearance-none font-medium"
                    >
                      <option value="" disabled>-- Pilih Kategori Surat --</option>
                      <option value="Surat Keterangan Mahasiswa Aktif">Surat Keterangan Mahasiswa Aktif</option>
                      <option value="Surat Pengantar Penelitian">Surat Pengantar Penelitian</option>
                      <option value="Surat Keterangan Lulus">Surat Keterangan Lulus</option>
                      <option value="Surat Pengantar Magang / PKL">Surat Pengantar Magang / PKL</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                      <FileType size={20} />
                    </div>
                  </div>
                </div>

                {/* Tujuan / Keperluan */}
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-2">Keperluan Pengajuan <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    placeholder="Contoh: Digunakan untuk persyaratan pembuatan BPJS Kesehatan..."
                    rows="4"
                    className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] resize-none font-medium"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 3. Upload Berkas */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-5">Lampiran Berkas</h3>
              
              <div className="w-full relative border-2 border-dashed border-gray-300 rounded-[16px] bg-gray-50 hover:bg-blue-50 hover:border-[#2A60A4] transition-colors group">
                <input 
                  type="file" 
                  required
                  onChange={handleFileChange}
                  accept=".pdf, .jpg, .jpeg, .png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-[#2A60A4]" size={32} />
                  </div>
                  {fileName ? (
                    <div className="text-[#2A60A4] font-bold text-[16px]">{fileName}</div>
                  ) : (
                    <>
                      <p className="text-[16px] font-bold text-gray-700 mb-1">Tarik & Lepas file di sini</p>
                      <p className="text-[14px] text-gray-500">atau klik untuk menelusuri komputer Anda</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Link 
                to="/user/dashboard" 
                className="px-6 py-3 rounded-[10px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-8 py-3 rounded-[10px] font-bold text-white bg-[#2A60A4] hover:bg-[#1f4b82] transition-colors shadow-md"
              >
                <Send size={18} strokeWidth={2.5} />
                Kirim Pengajuan
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}