import React, { useState, useEffect } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';
import ModalDetailPengajuan from '../../components/ModalDetailPengajuan'; 
import ConfirmModal from '../../components/ConfirmModal';
import { Search, Eye, X, Filter } from 'lucide-react';

export default function KelolaPengajuan() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    type: 'warning',
    message: '',
    onConfirm: null,
    showCancel: true,
    confirmText: 'Ya, Yakin'
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/surat', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const arrayData = Array.isArray(data) ? data : (data.data || []);
        
        const formattedData = arrayData.map(item => ({
          id: item.id,
          nama: item.user?.name || 'Mahasiswa',
          nim: item.user?.nim || '-', 
          jenis: item.jenis_surat, 
          tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          }),
          status: item.status, 
          keperluan: item.keperluan,
          lampiran: item.lampiran // <--- INI BAGIAN PENTING YANG DITAMBAHKAN
        }));
        
        setRequests(formattedData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter((item) => {
    const matchesSearch = item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.nim?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const executeUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/surat/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedRequests = requests.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        );
        setRequests(updatedRequests);
        
        if (selectedReq && selectedReq.id === id) {
          setSelectedReq({ ...selectedReq, status: newStatus });
        }
        
        if (newStatus === 'Selesai' || newStatus === 'Ditolak') {
          setIsModalOpen(false);
        }

        setPopupModal({
          isOpen: true,
          type: 'success',
          message: `Berhasil! Status pengajuan telah diubah menjadi ${newStatus}.`,
          onConfirm: null,
          showCancel: false,
          confirmText: 'OK'
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Gagal mengubah status surat.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server saat mengubah status.");
    }
  };

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

  const openDetailModal = (req) => {
    setSelectedReq(req);
    setIsModalOpen(true);
  };

  const statusTabs = ['Semua', 'Pending', 'Diproses', 'Selesai', 'Ditolak'];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="kelola-surat" />

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
            <span className="text-gray-700 font-medium text-[15px]">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-300 p-1">
            {statusTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-all ${
                  filterStatus === tab 
                    ? 'bg-[#2A60A4] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2.5 w-full md:w-[320px] focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Nama atau NIM..." 
              className="w-full ml-3 outline-none text-[14px] text-gray-700 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

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
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredRequests.length > 0 ? (
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
                          item.status === 'Pending' 
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
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openDetailModal(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#2A60A4] text-[#2A60A4] hover:bg-[#E8F0FA] rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          title="Lihat Detail Surat"
                        >
                          <Eye size={18} strokeWidth={2} />
                          <span className="text-[13px] font-bold">Lihat Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                      {searchTerm === '' 
                        ? (filterStatus === 'Semua' ? "Belum ada pengajuan surat masuk." : `Belum ada surat dengan status ${filterStatus}.`)
                        : `Tidak ada pengajuan yang cocok dengan pencarian "${searchTerm}".`
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <ModalDetailPengajuan 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedReq}
        onUpdateStatus={handleUpdateStatus} 
      />

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