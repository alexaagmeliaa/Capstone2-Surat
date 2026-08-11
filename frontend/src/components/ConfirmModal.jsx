import React from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  XCircle, 
  Download, 
  LogOut 
} from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message = "Apakah anda yakin ingin menghapus file ini?",
  confirmText,
  cancelText = "Tidak, Batalkan",
  type = "danger",
  showCancel = true
}) {
  if (!isOpen) return null;

  // Menentukan ikon & skema warna berdasarkan tipe pop-up
  let IconComponent = Info;
  let iconColor = 'text-[#2A60A4]';
  let btnColor = 'bg-[#2A60A4] hover:bg-[#1f4b82]';

  const isDanger = type === 'danger' || type === 'delete';
  
  if (isDanger) {
    IconComponent = Trash2;
    iconColor = 'text-[#C92A2A]';
    btnColor = 'bg-[#C92A2A] hover:bg-[#b02525]';
  } else if (type === 'error') {
    IconComponent = XCircle;
    iconColor = 'text-[#C92A2A]';
    btnColor = 'bg-[#C92A2A] hover:bg-[#b02525]';
  } else if (type === 'warning') {
    IconComponent = AlertTriangle;
    iconColor = 'text-amber-500';
    btnColor = 'bg-amber-500 hover:bg-amber-600';
  } else if (type === 'success') {
    IconComponent = CheckCircle2;
    iconColor = 'text-[#429961]';
    btnColor = 'bg-[#429961] hover:bg-[#347a4d]';
  } else if (type === 'download') {
    IconComponent = Download;
    iconColor = 'text-[#2A60A4]';
    btnColor = 'bg-[#2A60A4] hover:bg-[#1f4b82]';
  } else if (type === 'logout') {
    IconComponent = LogOut;
    iconColor = 'text-[#C92A2A]';
    btnColor = 'bg-[#C92A2A] hover:bg-[#b02525]';
  }

  // Apakah modal ini memiliki fungsi konfirmasi (2 tombol) atau hanya pemberitahuan (1 tombol)
  const isConfirmMode = showCancel && Boolean(onConfirm);
  const defaultConfirmText = confirmText || (isConfirmMode ? "Ya, Yakin" : "OK");

  const handlePrimaryClick = () => {
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      
      {/* Box Modal */}
      <div className="bg-[#F6F6F6] border border-gray-300 w-full max-w-[500px] rounded-[12px] shadow-2xl p-8 animate-fade-in-up text-center relative z-10">
        
        {/* Ikon Tengah */}
        <div className="flex justify-center mb-4">
          <IconComponent size={42} strokeWidth={1.5} className={iconColor} />
        </div>
        
        {/* Judul Modal (Opsional) */}
        {title && (
          <h3 className="text-[19px] font-bold text-gray-900 mb-2">
            {title}
          </h3>
        )}

        {/* Pesan Konfirmasi / Notifikasi */}
        <div className="text-[16px] font-medium text-gray-800 mb-8 leading-relaxed whitespace-pre-line">
          {message}
        </div>
        
        {/* Grup Tombol */}
        <div className="flex justify-center items-center gap-4">
          {isConfirmMode && (
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent border border-gray-400 text-gray-700 rounded-[8px] font-medium text-[15px] hover:bg-gray-200 transition-colors focus:outline-none"
            >
              {cancelText}
            </button>
          )}
          
          <button 
            type="button"
            onClick={handlePrimaryClick}
            className={`px-6 py-2.5 text-white rounded-[8px] font-medium text-[15px] transition-colors focus:outline-none shadow-sm ${btnColor}`}
          >
            {defaultConfirmText}
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