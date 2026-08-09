import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function ModalMahasiswa({ 
  isOpen, 
  onClose, 
  onSave, 
  mode = 'add', 
  initialData 
}) {
  // Data default form yang mencakup semua field yang kamu minta
  const defaultData = { 
    id: null, 
    nim: '', 
    nama: '', 
    prodi: 'S1 - Teknik Informatika', 
    angkatan: '',
    status: 'Aktif',
    jenis_mhs: 'Reguler',
    jenis_kelamin: 'Laki-Laki',
    dosen_wali: '',
    ttl: '',
    alamat: '',
    email: '',
    password: ''
  };
  
  const [formData, setFormData] = useState(initialData || defaultData);

  useEffect(() => {
    setFormData(initialData || defaultData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md transition-opacity p-4">
      
      <div className="bg-white w-full max-w-3xl rounded-[16px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-xl font-bold text-[#182D4A]">
            {mode === 'add' ? 'Tambah Data Mahasiswa' : 'Edit Data Mahasiswa'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>
        
        {/* Form Modal (Scrollable content) */}
        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <form id="mahasiswaForm" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              {/* Kolom Kiri & Kanan */}
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Nomor Induk Mahasiswa (NIM) <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.nim} onChange={(e) => setFormData({ ...formData, nim: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
              </div>
              
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Program Studi <span className="text-red-500">*</span></label>
                <select required value={formData.prodi} onChange={(e) => setFormData({ ...formData, prodi: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium">
                  <option value="S1 - Teknik Informatika">S1 - Teknik Informatika</option>
                  <option value="S1 - Sistem Informasi">S1 - Sistem Informasi</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Angkatan (Tahun) <span className="text-red-500">*</span></label>
                <input type="number" required placeholder="Cth: 2023" value={formData.angkatan} onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium">
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Jenis Mahasiswa <span className="text-red-500">*</span></label>
                <select required value={formData.jenis_mhs} onChange={(e) => setFormData({ ...formData, jenis_mhs: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium">
                  <option value="Reguler">Reguler</option>
                  <option value="Karyawan">Karyawan</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                <select required value={formData.jenis_kelamin} onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium">
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Dosen Wali</label>
                <input type="text" value={formData.dosen_wali} onChange={(e) => setFormData({ ...formData, dosen_wali: e.target.value })} placeholder="Nama Dosen Wali" className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tempat, Tanggal Lahir</label>
                <input type="text" value={formData.ttl} onChange={(e) => setFormData({ ...formData, ttl: e.target.value })} placeholder="Cth: Bandung, 15 Agustus 2001" className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Alamat Lengkap</label>
                <textarea rows="3" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} placeholder="Alamat domisili saat ini..." className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium resize-none"></textarea>
              </div>

              {/* Data Akun Login (Email & Password) */}
              <div className="md:col-span-2 pt-4 border-t border-gray-200 mt-2">
                <h4 className="text-[16px] font-bold text-[#182D4A] mb-4">Informasi Akun (Login)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Email Kampus <span className="text-red-500">*</span></label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@mahasiswa.stmik.ac.id" className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                    <input type={mode === 'add' ? 'text' : 'password'} required={mode === 'add'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={mode === 'add' ? "Password default..." : "Kosongkan jika tidak ingin diubah"} className="w-full bg-white border border-gray-300 rounded-[8px] px-3.5 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium" />
                  </div>
                </div>
              </div>


            </div>

          </form>
        </div>

        {/* Footer Modal / Tombol Aksi */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-[10px] font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
            Batal
          </button>
          <button type="submit" form="mahasiswaForm" className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] font-bold text-white bg-[#2A60A4] hover:bg-[#1f4b82] transition-colors shadow-sm">
            <Check size={18} strokeWidth={2.5} />
            Simpan Data
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Custom Scrollbar agar rapi */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}} />
    </div>
  );
}