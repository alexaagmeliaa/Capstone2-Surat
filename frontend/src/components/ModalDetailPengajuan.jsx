import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function ModalDetailPengajuan({ isOpen, onClose, data, onUpdateStatus }) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-30 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-2xl rounded-[16px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-[18px] font-bold text-[#182D4A]">Detail Pengajuan Surat</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>
        
        {/* Body Modal (Scrollable) */}
        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-[13px] font-semibold text-gray-500 mb-1">Nama Mahasiswa</p>
              <p className="text-[15px] font-bold text-gray-800">{data.nama}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-500 mb-1">Nomor Induk Mahasiswa (NIM)</p>
              <p className="text-[15px] font-bold text-gray-800">{data.nim}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-500 mb-1">Jenis Surat</p>
              <p className="text-[15px] font-bold text-[#2A60A4]">{data.jenis}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-500 mb-1">Tanggal Pengajuan</p>
              <p className="text-[15px] font-bold text-gray-800">{data.tanggal}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[13px] font-semibold text-gray-500 mb-2">Keperluan / Keterangan</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-[14.5px] text-gray-700 leading-relaxed">
              Pengajuan surat ini diperuntukkan untuk melengkapi dokumen persyaratan administrasi mahasiswa yang bersangkutan. (Contoh detail keperluan dari database)
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-500 mb-2">Lampiran Berkas (Dari Mahasiswa)</p>
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md text-[#2A60A4] shadow-sm">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#182D4A]">berkas_persyaratan_{data.nim}.pdf</p>
                  <p className="text-[12px] text-gray-500">1.2 MB</p>
                </div>
              </div>
              <button 
                onClick={() => setDownloadModalOpen(true)}
                className="flex items-center gap-2 text-[13px] font-bold text-[#2A60A4] hover:bg-white px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-blue-200"
              >
                <Download size={16} /> Unduh
              </button>
            </div>
          </div>

        </div>

        <ConfirmModal 
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
          message={`Mengunduh berkas_persyaratan_${data.nim}.pdf...`}
          type="download"
          showCancel={false}
          confirmText="Tutup"
        />

        {/* Footer Modal: Tombol Aksi Cepat berdasarkan Status */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <span className={`px-4 py-1.5 text-[12px] font-bold rounded-full border ${
            data.status === 'Pending' || data.status === 'Diterima' ? 'border-[#D9A036] text-[#D9A036] bg-[#FDF8E9]' :
            data.status === 'Diproses' ? 'border-[#2A60A4] text-[#2A60A4] bg-[#E8F0FA]' :
            data.status === 'Ditolak' ? 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]' :
            'border-[#429961] text-[#429961] bg-[#E8F5EB]'
          }`}>
            Status Saat Ini: {data.status.toUpperCase()}
          </span>

          <div className="flex gap-3">
            {/* Tampilkan aksi jika properti onUpdateStatus diberikan (Bisa disembunyikan di dashboard jika hanya view) */}
            {onUpdateStatus && (
              <>
                {(data.status === 'Pending' || data.status === 'Diterima') && (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(data.id, 'Ditolak')}
                      className="px-4 py-2 rounded-lg font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors text-[14px]"
                    >
                      Tolak
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(data.id, 'Diproses')}
                      className="px-5 py-2 rounded-lg font-bold text-white bg-[#2A60A4] hover:bg-[#1f4b82] transition-colors text-[14px] shadow-sm"
                    >
                      Proses Surat
                    </button>
                  </>
                )}
                
                {data.status === 'Diproses' && (
                  <button 
                    onClick={() => onUpdateStatus(data.id, 'Selesai')}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-white bg-[#429961] hover:bg-[#327a4b] transition-colors text-[14px] shadow-sm"
                  >
                    <CheckCircle2 size={16} /> Tandai Selesai
                  </button>
                )}
              </>
            )}

            {(data.status === 'Selesai' || data.status === 'Ditolak' || !onUpdateStatus) && (
              <button 
                onClick={onClose}
                className="px-5 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors text-[14px]"
              >
                Tutup
              </button>
            )}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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