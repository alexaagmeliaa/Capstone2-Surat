import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Upload, Eye } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function ModalDetailPengajuan({ isOpen, onClose, data, onUpdateStatus }) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  
  // State untuk menyimpan file PDF upload manual (opsional)
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen || !data) return null;

  const getFileInfo = (lampiran) => {
    if (!lampiran) return null;
    if (lampiran.includes('|')) {
      const [name, path] = lampiran.split('|');
      return { name, path };
    }
    return { name: lampiran.split('/').pop(), path: lampiran };
  };

  const fileInfo = getFileInfo(data.lampiran);

  // Handle pemilihan file PDF manual oleh admin
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Harap pilih file dengan format PDF!');
      e.target.value = null;
    }
  };

  // Handler saat tombol aksi diklik (mengirim status dan file opsional)
  const handleActionClick = (statusTarget) => {
    onUpdateStatus(data.id, statusTarget, selectedFile);
    setSelectedFile(null); // Reset setelah dikirim
  };

  // Fungsi untuk membuka tab baru preview PDF surat otomatis
  const handlePreviewPdf = () => {
    const token = sessionStorage.getItem('token');
    window.open(`http://localhost:8000/api/admin/surat/${data.id}/preview?token=${token}`, '_blank');
  };

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
        
        {/* Body Modal */}
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
            <p className="text-[13px] font-semibold text-gray-500 mb-2">Ditujukan Kepada (Instansi / Perusahaan)</p>
            <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-100 text-[14.5px] font-semibold text-[#182D4A]">
              {data.tujuan_surat || 'Tidak ada keterangan tujuan instansi.'}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[13px] font-semibold text-gray-500 mb-2">Keperluan / Keterangan</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-[14.5px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.keperluan || 'Tidak ada keterangan tambahan dari mahasiswa.'}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[13px] font-semibold text-gray-500 mb-2">Lampiran Berkas (Dari Mahasiswa)</p>
            {fileInfo ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white rounded-md text-[#2A60A4] shadow-sm flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#182D4A] truncate" title={fileInfo.name}>
                      {fileInfo.name}
                    </p>
                    <p className="text-[12px] text-gray-500">Berkas Terlampir</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.open(`http://localhost:8000/storage/${fileInfo.path}`, '_blank')}
                  className="flex items-center gap-2 text-[13px] font-bold text-[#2A60A4] hover:bg-white px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-blue-200 flex-shrink-0"
                >
                  <Download size={16} /> Unduh
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                <p className="text-[14px] text-gray-500 italic">Mahasiswa tidak menyertakan lampiran berkas.</p>
              </div>
            )}
          </div>

          {/* --- TOMBOL PREVIEW SURAT OTOMATIS (TERKUNCI JIKA PENDING) --- */}
          <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition-all ${
            data.status === 'Pending' || data.status === 'Diterima' 
              ? 'bg-gray-100 border-gray-200 opacity-70' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <p className="text-[14px] font-bold text-gray-800">Pratinjau Surat Otomatis</p>
              <p className="text-[12px] text-gray-500">
                {data.status === 'Pending' || data.status === 'Diterima' 
                  ? 'Klik tombol "Proses Surat" terlebih dahulu untuk membuka pratinjau.' 
                  : 'Lihat hasil cetak surat dari sistem sebelum menyelesaikannya.'}
              </p>
            </div>
            <button
              onClick={handlePreviewPdf}
              disabled={data.status === 'Pending' || data.status === 'Diterima'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-colors shadow-sm ${
                data.status === 'Pending' || data.status === 'Diterima'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : 'bg-white border border-[#2A60A4] text-[#2A60A4] hover:bg-blue-50 cursor-pointer'
              }`}
            >
              <Eye size={16} /> Preview PDF
            </button>
          </div>

          {/* --- OPSI UPLOAD MANUAL (OPSIONAL) --- */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Upload Berkas Surat Selesai (Opsional - Jika dikosongkan, sistem akan generate otomatis):
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#2A60A4] bg-gray-50 hover:bg-blue-50/30 rounded-xl py-3 px-4 cursor-pointer transition-all">
                <Upload size={18} className="text-gray-500" />
                <span className="text-[13px] font-medium text-gray-600 truncate">
                  {selectedFile ? selectedFile.name : 'Pilih file PDF'}
                </span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              {selectedFile && (
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Batalkan
                </button>
              )}
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

        {/* Footer Modal */}
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
            {onUpdateStatus && (
              <>
                {(data.status === 'Pending' || data.status === 'Diterima') && (
                  <>
                    <button 
                      onClick={() => handleActionClick('Ditolak')}
                      className="px-4 py-2 rounded-lg font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors text-[14px]"
                    >
                      Tolak
                    </button>
                    <button 
                      onClick={() => handleActionClick('Diproses')}
                      className="px-5 py-2 rounded-lg font-bold text-white bg-[#2A60A4] hover:bg-[#1f4b82] transition-colors text-[14px] shadow-sm"
                    >
                      Proses Surat
                    </button>
                  </>
                )}
                
                {data.status === 'Diproses' && (
                  <button 
                    onClick={() => handleActionClick('Selesai')}
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