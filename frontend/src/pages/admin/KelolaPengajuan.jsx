import React, { useState } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';
import ModalDetailPengajuan from '../../components/ModalDetailPengajuan'; // <-- Import Modal Baru
import ConfirmModal from '../../components/ConfirmModal';
import dummyData from '../../data/dummy.json';
import { Search, XCircle, Clock, CheckCircle2, Eye, X } from 'lucide-react';

export default function KelolaPengajuan() {
  const [requests, setRequests] = useState(dummyData.pengajuanTerbaru || []);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk kontrol Modal Detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  // State untuk Popup Confirm & Notification Modal
  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    type: 'warning',
    message: '',
    onConfirm: null,
    showCancel: true,
    confirmText: 'Ya, Yakin'
  });

  // 1. Fungsi Pencarian (Filter by Nama atau NIM)
  const filteredRequests = requests.filter((item) =>
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.nim?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eksekusi perubahan status sesungguhnya
  const executeUpdateStatus = (id, newStatus) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    
    // Update state tabel
    setRequests(updatedRequests);
    
    // Jika modal sedang terbuka, update juga state di dalam modal agar tampilannya berubah seketika
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq({ ...selectedReq, status: newStatus });
    }

    if (newStatus === 'Selesai' || newStatus === 'Ditolak') {
      setIsModalOpen(false);
    }

    // Tampilkan pemberitahuan sukses
    setPopupModal({
      isOpen: true,
      type: 'success',
      message: `Status pengajuan berhasil diubah menjadi ${newStatus}.`,
      onConfirm: null,
      showCancel: false,
      confirmText: 'OK'
    });
  };

  // 2. Fungsi Mengubah Status (Membuka Modal Konfirmasi)
  const handleUpdateStatus = (id, newStatus) => {
    const modalType = newStatus === 'Ditolak' ? 'danger' : newStatus === 'Selesai' ? 'success' : 'warning';
    
    setPopupModal({
      isOpen: true,
      type: modalType,
      message: `Apakah Anda yakin ingin mengubah status pengajuan ini menjadi "${newStatus}"?`,
      showCancel: true,
      confirmText: 'Ya, Yakin',
      onConfirm: () => executeUpdateStatus(id, newStatus)
    });
  };

  // 3. Fungsi Buka Modal Detail
  const openDetailModal = (req) => {
    setSelectedReq(req);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="kelola" />

      <main className="flex-1 px-10 py-10 overflow-y-auto relative">
        
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Kelola Surat</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Lihat dan proses permintaan surat dari mahasiswa.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <ProfileDropdown />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">10 Agustus 2026</span>
          </div>
        </header>

        {/* Toolbar Pencarian */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center bg-white border border-gray-300 rounded-[12px] px-4 py-3 w-full md:w-[380px] focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm transition-all">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari NIM atau Nama Mahasiswa..." 
              className="w-full ml-3 outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tabel Data Pengajuan */}
        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[30%]">Nama / NIM</th>
                  <th className="px-6 py-4 font-semibold w-[25%]">Jenis Surat</th>
                  <th className="px-6 py-4 font-semibold w-[15%]">Tanggal</th>
                  <th className="px-6 py-4 font-semibold w-[15%]">Status</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((item) => (
                    <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-bold text-[#182D4A]">{item.nama}</div>
                        <div className="text-[13px] font-medium text-gray-600 mt-0.5">{item.nim}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-800 font-medium">{item.jenis}</td>
                      <td className="px-6 py-4 text-[14px] text-gray-700">{item.tanggal}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 text-[12px] font-bold rounded-full border inline-block ${
                          item.status === 'Pending' || item.status === 'Diterima'
                            ? 'border-[#D9A036] text-[#D9A036] bg-[#FDF8E9]' 
                            : item.status === 'Diproses'
                              ? 'border-[#2A60A4] text-[#2A60A4] bg-[#E8F0FA]' 
                              : item.status === 'Ditolak' 
                                ? 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]' 
                                : 'border-[#429961] text-[#429961] bg-[#E8F5EB]' 
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          
                          {/* Tombol Lihat: Selalu muncul di semua status */}
                          <button 
                            onClick={() => openDetailModal(item)}
                            className="p-2 bg-white border border-gray-400 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                            title="Lihat Detail Surat"
                          >
                            <Eye size={18} strokeWidth={2} />
                          </button>

                          {/* Jika status PENDING/DITERIMA: Muncul Proses & Tolak */}
                          {(item.status === 'Pending' || item.status === 'Diterima') && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'Diproses')}
                                className="p-2 bg-white border border-[#2A60A4] text-[#2A60A4] hover:bg-[#E8F0FA] rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                title="Mulai Proses Surat"
                              >
                                <Clock size={18} strokeWidth={2} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'Ditolak')}
                                className="p-2 bg-white border border-[#E05252] text-[#E05252] hover:bg-[#FCEAEA] rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                                title="Tolak Surat"
                              >
                                <XCircle size={18} strokeWidth={2} />
                              </button>
                            </>
                          )}

                          {/* Jika status DIPROSES: Muncul tombol Selesai */}
                          {item.status === 'Diproses' && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'Selesai')}
                              className="p-2 bg-white border border-[#429961] text-[#429961] hover:bg-[#E8F5EB] rounded-lg transition-colors shadow-sm flex items-center gap-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-200"
                              title="Tandai Selesai"
                            >
                              <CheckCircle2 size={18} strokeWidth={2} />
                              <span className="text-[13px] font-bold hidden lg:inline">Selesai</span>
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Tidak ada pengajuan yang cocok dengan pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Panggil Modal Detail Pengajuan */}
      <ModalDetailPengajuan 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedReq}
        onUpdateStatus={handleUpdateStatus} 
      />

      {/* Panggil Modal Konfirmasi / Notifikasi Status */}
      <ConfirmModal 
        isOpen={popupModal.isOpen}
        onClose={() => setPopupModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={popupModal.onConfirm ? () => {
          const action = popupModal.onConfirm;
          setPopupModal(prev => ({ ...prev, isOpen: false }));
          action();
        } : null}
        message={popupModal.message}
        type={popupModal.type}
        showCancel={popupModal.showCancel}
        confirmText={popupModal.confirmText}
      />

    </div>
  );
}