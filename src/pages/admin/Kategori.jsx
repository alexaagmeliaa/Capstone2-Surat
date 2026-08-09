import React, { useState } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';
import ModalKategori from '../../components/ModalKategori'; 
import ConfirmModal from '../../components/ConfirmModal'; // <-- Import ConfirmModal
import dummyData from '../../data/dummy.json';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

export default function Kategori() {
  const [kategoriSurat, setKategoriSurat] = useState(dummyData.kategoriSurat || []);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Kontrol Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedKategori, setSelectedKategori] = useState(null);

  // State untuk Kontrol Modal Konfirmasi Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Menyimpan ID yang mau dihapus

  // Fungsi Pencarian
  const filteredKategori = kategoriSurat.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setModalMode('add');
    setSelectedKategori({ id: null, nama: '', deskripsi: '' }); 
    setIsModalOpen(true);
  };

  const openEditModal = (kategori) => {
    setModalMode('edit');
    setSelectedKategori(kategori); 
    setIsModalOpen(true);
  };

  const handleSaveModal = (formData) => {
    if (modalMode === 'add') {
      const newKategori = { ...formData, id: Date.now() };
      setKategoriSurat([...kategoriSurat, newKategori]);
    } else {
      const updatedKategori = kategoriSurat.map(item => 
        item.id === formData.id ? formData : item
      );
      setKategoriSurat(updatedKategori);
    }
    setIsModalOpen(false); 
  };

  // --- LOGIKA HAPUS YANG BARU ---
  
  // 1. Tombol tong sampah diklik, buka modal konfirmasi
  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 2. Tombol "Ya, Yakin" di klik di dalam modal
  const confirmDelete = () => {
    const filtered = kategoriSurat.filter(item => item.id !== itemToDelete);
    setKategoriSurat(filtered);
    setIsDeleteModalOpen(false); // Tutup modal
    setItemToDelete(null); // Bersihkan state
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      <Sidebar activeMenu="kategori" />

      <main className="flex-1 px-10 py-10 overflow-y-auto relative">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Kategori Surat</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Kelola jenis dan format surat yang tersedia untuk mahasiswa.</p>
          </div>
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <ProfileDropdown />
            </div>
            <span className="text-gray-700 font-medium text-[15px]">10 Agustus 2026</span>
          </div>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center bg-white border border-gray-300 rounded-[12px] px-4 py-3 w-full md:w-80 focus-within:ring-2 focus-within:ring-[#2A60A4] shadow-sm transition-all">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kategori surat..." 
              className="w-full ml-3 outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#2A60A4] text-white px-6 py-3 rounded-[12px] hover:bg-[#1f4b82] transition-colors shadow-md font-semibold text-[15px]"
          >
            <Plus size={20} strokeWidth={2.5} />
            Tambah Kategori
          </button>
        </div>

        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[15px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[5%] text-center">No</th>
                  <th className="px-6 py-4 font-semibold w-[35%]">Nama Kategori</th>
                  <th className="px-6 py-4 font-semibold w-[45%]">Deskripsi / Keterangan</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {filteredKategori.length > 0 ? (
                  filteredKategori.map((item, index) => (
                    <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                      <td className="px-6 py-5 text-[15px] text-black font-medium text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[15px] font-bold text-[#2A60A4]">{item.nama}</div>
                      </td>
                      <td className="px-6 py-5 text-[14px] text-gray-700 leading-relaxed pr-10">
                        {item.deskripsi}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-[#2A60A4] hover:border-[#2A60A4] rounded-lg transition-colors shadow-sm" 
                            title="Edit Kategori"
                          >
                            <Edit size={18} strokeWidth={2} />
                          </button>
                          
                          {/* Ubah onClick menjadi openDeleteConfirm */}
                          <button 
                            onClick={() => openDeleteConfirm(item.id)}
                            className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 rounded-lg transition-colors shadow-sm" 
                            title="Hapus Kategori"
                          >
                            <Trash2 size={18} strokeWidth={2} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Tidak ada kategori surat yang cocok dengan pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ModalKategori 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        mode={modalMode}
        initialData={selectedKategori}
      />

      {/* Panggil Modal Konfirmasi Universal Di Sini */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Apakah anda yakin ingin menghapus kategori ini?"
        type="danger"
      />

    </div>
  );
}