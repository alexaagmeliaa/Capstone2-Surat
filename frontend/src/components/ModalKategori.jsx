import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function ModalKategori({ 
  isOpen, 
  onClose, 
  onSave, 
  mode = 'add', 
  initialData 
}) {
  const defaultData = { id: null, nama: '', deskripsi: '' };
  
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
    // Di sini perubahannya: bg-black bg-opacity-20 (lebih terang) dan backdrop-blur-md (blur lebih kuat)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-20 backdrop-blur-md transition-opacity">
      
      <div className="bg-white w-full max-w-lg rounded-[16px] shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-[#182D4A]">
            {mode === 'add' ? 'Tambah Kategori Baru' : 'Edit Kategori'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-2">Nama Kategori <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Surat Keterangan Lulus"
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium"
            />
          </div>
          
          <div>
            <label className="block text-[14px] font-semibold text-gray-700 mb-2">Deskripsi Kategori <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows="4"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Tuliskan keterangan kegunaan surat ini..."
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-3 text-gray-700 outline-none focus:border-[#2A60A4] focus:ring-1 focus:ring-[#2A60A4] font-medium resize-none"
            ></textarea>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex justify-end gap-3">
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