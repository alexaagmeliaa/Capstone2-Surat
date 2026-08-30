import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function ModalKategori({ 
  isOpen, 
  onClose, 
  onSave, 
  mode = 'add', 
  initialData 
}) {
  const defaultData = { 
    id: null, 
    kode_kategori: '', 
    nama: '', 
    jenis_kategori: '', 
    deskripsi: '', 
    catatan: '', // TAMBAHAN: State untuk syarat lampiran
    status: true 
  };
  
  const [formData, setFormData] = useState(initialData || defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        kode_kategori: initialData.kode_kategori || '',
        nama: initialData.nama || initialData.nama_kategori || '',
        jenis_kategori: initialData.jenis_kategori || '',
        deskripsi: initialData.deskripsi || '',
        catatan: initialData.catatan || '', // TAMBAHAN: Membaca data catatan jika mode edit
        status: initialData.status !== undefined ? Boolean(initialData.status) : true
      });
    } else {
      setFormData(defaultData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-20 backdrop-blur-md transition-opacity p-4">
      
      <div className="bg-white w-full max-w-lg rounded-[16px] shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-[#182D4A]">
            {mode === 'add' ? 'Tambah Kategori Baru' : 'Edit Kategori'}
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Kode Kategori */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-1">Kode Kategori <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={formData.kode_kategori}
              onChange={(e) => setFormData({ ...formData, kode_kategori: e.target.value })}
              placeholder="Contoh: SK"
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium"
            />
          </div>

          {/* Nama Kategori */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Surat Keterangan Aktif Kuliah"
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium"
            />
          </div>

          {/* Klasifikasi / Jenis Kategori (Dropdown Pilihan Utama) */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-1">
              Klasifikasi / Jenis Kategori <span className="text-red-500">*</span>
            </label>
            <select 
              required
              value={formData.jenis_kategori}
              onChange={(e) => setFormData({ ...formData, jenis_kategori: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium cursor-pointer"
            >
              <option value="" disabled>-- Pilih Klasifikasi Surat --</option>
              <option value="Surat Keterangan">Surat Keterangan</option>
              <option value="Surat Pengantar">Surat Pengantar</option>
              <option value="Surat Permohonan">Surat Permohonan</option>
            </select>
          </div>
          
          {/* Deskripsi */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-1">Deskripsi Kategori</label>
            <textarea 
              rows="3"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Tuliskan keterangan kegunaan surat ini..."
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium resize-none"
            ></textarea>
          </div>

          {/* TAMBAHAN: Catatan / Syarat Lampiran */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-1">Syarat Lampiran <span className="text-sm font-normal text-gray-500">(Opsional)</span></label>
            <textarea 
              rows="2"
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              placeholder="Contoh: Wajib melampirkan fotokopi KTP / Transkrip Nilai..."
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium resize-none"
            ></textarea>
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="statusCheck"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="w-4 h-4 text-[#2A60A4] bg-gray-100 border-gray-300 rounded focus:ring-[#2A60A4] cursor-pointer"
            />
            <label htmlFor="statusCheck" className="text-[14px] font-semibold text-gray-700 cursor-pointer">
              Status Aktif (Tampilkan di pilihan mahasiswa)
            </label>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-[10px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] font-bold text-white bg-[#2A60A4] hover:bg-[#1f4b82] transition-colors shadow-sm"
            >
              <Check size={18} strokeWidth={2.5} />
              Simpan Kategori
            </button>
          </div>
        </form>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}