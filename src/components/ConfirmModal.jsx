import React from 'react';
import { Trash2, AlertTriangle, Info } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message = "Apakah anda yakin ingin menghapus file ini?",
  confirmText = "Ya, Yakin",
  cancelText = "Tidak, Batalkan",
  type = "danger"
}) {
  if (!isOpen) return null;

  // Menentukan warna tombol & icon berdasarkan tipe konfirmasi (Universal)
  const isDanger = type === 'danger';
  const IconComponent = isDanger ? Trash2 : type === 'warning' ? AlertTriangle : Info;
  const iconColor = isDanger ? 'text-[#C92A2A]' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500';
  const btnColor = isDanger ? 'bg-[#C92A2A] hover:bg-[#b02525]' : type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-20 backdrop-blur-md transition-opacity">
      
      {/* Box Modal (Warna bg agak abu-abu terang menyesuaikan gambar) */}
      <div className="bg-[#F6F6F6] border border-gray-300 w-full max-w-[500px] rounded-[10px] shadow-lg p-8 animate-fade-in-up text-center">
        
        {/* Ikon Tengah */}
        <div className="flex justify-center mb-4">
          <IconComponent size={38} strokeWidth={1.5} className={iconColor} />
        </div>
        
        {/* Pesan Konfirmasi */}
        <h3 className="text-[17px] font-medium text-black mb-8 leading-snug">
          {message}
        </h3>
        
        {/* Grup Tombol */}
        <div className="flex justify-center items-center gap-4">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent border border-gray-400 text-gray-700 rounded-[8px] font-medium text-[15px] hover:bg-gray-100 transition-colors focus:outline-none"
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white rounded-[8px] font-medium text-[15px] transition-colors focus:outline-none ${btnColor}`}
          >
            {confirmText}
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}