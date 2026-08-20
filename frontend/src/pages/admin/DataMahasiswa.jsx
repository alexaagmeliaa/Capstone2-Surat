import React, { useState, useEffect } from 'react';
import ProfileDropdown from '../../components/ProfileDropdown';
import NotificationDropdown from '../../components/NotificationDropdown';
import Sidebar from '../../components/Sidebar';
import ModalMahasiswa from '../../components/ModalMahasiswa';
import ConfirmModal from '../../components/ConfirmModal';
import { Search, Bell, Plus, FileUp, Edit, Trash2, X } from 'lucide-react';

export default function DataMahasiswa() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Notifikasi
  const [popupModal, setPopupModal] = useState({ 
    isOpen: false, 
    type: 'success', 
    message: '', 
    showCancel: false, 
    confirmText: 'OK', 
    onConfirm: null 
  });

  // State Kontrol Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedMhs, setSelectedMhs] = useState(null);

  // State Kontrol Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- 1. TARIK DATA MAHASISWA DARI DATABASE SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/mahasiswa', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        const arrayData = Array.isArray(data) ? data : (data.data || []);
        setMahasiswa(arrayData);
      }
    } catch (error) {
      console.error("Gagal memuat data mahasiswa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fungsi Pencarian (Filter NIM atau Nama)
  const filteredMhs = mahasiswa.filter((item) =>
    (item.nim || item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.nama || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Fungsi Modal Tambah
  const openAddModal = () => {
    setModalMode('add');
    setSelectedMhs(null);
    setIsModalOpen(true);
  };

  // 4. Fungsi Modal Edit
  const openEditModal = (data) => {
    setModalMode('edit');
    setSelectedMhs(data);
    setIsModalOpen(true);
  };

  // 5. Handle Simpan (Terhubung ke Backend)
  const handleSaveModal = async (formData) => {
    if (modalMode === 'add') {
      try {
        const generatedEmail = formData.email || `${formData.nim || Date.now()}@student.kampus.ac.id`;

        const response = await fetch('http://localhost:8000/api/admin/register-mahasiswa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          },
          // PASTIKAN SEMUA DATA INI ADA SAAT TAMBAH DATA
          body: JSON.stringify({
            name: formData.nama || formData.name,
            email: generatedEmail,
            password: formData.password || 'password123',
            nim: formData.nim,
            prodi: formData.prodi,
            jenis_mhs: formData.jenis_mhs,
            angkatan: formData.angkatan,
            jenis_kelamin: formData.jenis_kelamin, 
            dosen_wali: formData.dosen_wali,
            ttl: formData.ttl,
            alamat: formData.alamat,
            status: formData.status,
          })
        });

        const data = await response.json();

        if (response.ok) {
          setIsModalOpen(false);
          setPopupModal({
            isOpen: true,
            type: 'success',
            message: 'Berhasil! Akun mahasiswa baru telah terdaftar.',
            showCancel: false,
            confirmText: 'OK',
            onConfirm: () => fetchMahasiswa()
          });
        } else {
          setIsModalOpen(false);
          setPopupModal({
            isOpen: true,
            type: 'danger',
            message: `Gagal mendaftar: ${data.message || data.pesan || 'Email sudah terdaftar.'}`,
            showCancel: false,
            confirmText: 'Tutup',
            onConfirm: null
          });
        }
      } catch (error) {
        setIsModalOpen(false);
        setPopupModal({
          isOpen: true,
          type: 'danger',
          message: 'Terjadi kesalahan koneksi ke server!',
          showCancel: false,
          confirmText: 'Tutup',
          onConfirm: null
        });
      }
    } else {
      // BAGIAN EDIT DATA
      try {
        const response = await fetch(`http://localhost:8000/api/admin/mahasiswa/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          },
          // PASTIKAN SEMUA DATA INI ADA SAAT EDIT DATA
          body: JSON.stringify({
            name: formData.nama || formData.name,
            email: formData.email,
            nim: formData.nim,
            prodi: formData.prodi,
            jenis_mhs: formData.jenis_mhs,
            angkatan: formData.angkatan,
            jenis_kelamin: formData.jenis_kelamin,
            dosen_wali: formData.dosen_wali,
            ttl: formData.ttl,
            alamat: formData.alamat,
            status: formData.status,
            password: formData.password || undefined,
          })
        });

        const data = await response.json();

        if (response.ok) {
          setIsModalOpen(false);
          setPopupModal({
            isOpen: true,
            type: 'success',
            message: 'Berhasil! Data mahasiswa telah diperbarui.',
            showCancel: false,
            confirmText: 'OK',
            onConfirm: () => fetchMahasiswa()
          });
        } else {
          setIsModalOpen(false);
          setPopupModal({
            isOpen: true,
            type: 'danger',
            message: `Gagal memperbarui: ${data.message || 'Terjadi kesalahan.'}`,
            showCancel: false,
            confirmText: 'Tutup',
            onConfirm: null
          });
        }
      } catch (error) {
        setIsModalOpen(false);
        setPopupModal({
          isOpen: true,
          type: 'danger',
          message: 'Terjadi kesalahan koneksi ke server!',
          showCancel: false,
          confirmText: 'Tutup',
          onConfirm: null
        });
      }
    }
  };

  // 6. Fungsi Modal Hapus
  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 7. Eksekusi Hapus Data (Terhubung ke Backend)
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/mahasiswa/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        fetchMahasiswa(); // Muat ulang data dari database agar tabel terupdate otomatis
      } else {
        alert('Gagal menghapus data.');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
      
      <Sidebar activeMenu="mahasiswa" />

      <main className="flex-1 px-10 py-10 overflow-y-auto relative">
        
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[44px] font-semibold text-[#2A60A4]">Data Mahasiswa</h2>
            <p className="text-gray-500 text-[16px] mt-1 font-medium">Kelola basis data mahasiswa STMIK untuk keperluan administrasi surat.</p>
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

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          
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
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-white border border-[#2A60A4] text-[#2A60A4] px-5 py-3 rounded-[12px] hover:bg-[#E8F0FA] transition-colors shadow-sm font-semibold text-[14px] w-full md:w-auto">
              <FileUp size={18} strokeWidth={2.5} />
              Import Data
            </button>
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-[#2A60A4] text-white px-5 py-3 rounded-[12px] hover:bg-[#1f4b82] transition-colors shadow-sm font-semibold text-[14px] w-full md:w-auto"
            >
              <Plus size={18} strokeWidth={2.5} />
              Tambah Mahasiswa
            </button>
          </div>

        </div>

        <div className="bg-[#F4F5F7] rounded-[12px] border-[1.5px] border-gray-400 shadow-[0_8px_15px_rgb(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E2E4E8] text-black text-[14px] border-b-[1.5px] border-gray-400">
                  <th className="px-6 py-4 font-semibold w-[15%]">NIM / Email</th>
                  <th className="px-6 py-4 font-semibold w-[27%]">Nama Mahasiswa</th>
                  <th className="px-6 py-4 font-semibold w-[20%]">Program Studi</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Jenis Mahasiswa</th>
                  <th className="px-6 py-4 font-semibold w-[10%] text-center">Angkatan</th>
                  <th className="px-6 py-4 font-semibold w-[10%] text-center">Status</th>
                  <th className="px-6 py-4 font-semibold w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-gray-400">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredMhs.length > 0 ? (
                  filteredMhs.map((item) => (
                    <tr key={item.id} className="bg-[#F4F5F7] hover:bg-[#EAECEF] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-bold text-[#2A60A4]">{item.nim || item.id}</div>
                        <div className="text-[12px] font-medium text-gray-500">{item.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-medium text-black">{item.nama || item.name}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-700">
                        {item.prodi || '-'}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-700 text-center font-medium">
                        {item.jenis_mhs || '-'}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-700 text-center font-medium">
                        {item.angkatan || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-1 text-[12px] font-bold rounded-full border ${
                          (item.status || 'Aktif') === 'Aktif' 
                            ? 'border-[#429961] text-[#429961] bg-[#E8F5EB]' 
                            : 'border-[#E05252] text-[#E05252] bg-[#FCEAEA]'
                        }`}>
                          {item.status || 'Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-[#2A60A4] hover:border-[#2A60A4] rounded-lg transition-colors shadow-sm" 
                            title="Edit Data"
                          >
                            <Edit size={16} strokeWidth={2} />
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm(item.id)}
                            className="p-2 bg-white border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-600 rounded-lg transition-colors shadow-sm" 
                            title="Hapus Data"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-medium">
                      Belum ada data mahasiswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <ModalMahasiswa 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        mode={modalMode}
        initialData={selectedMhs}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Apakah anda yakin ingin menghapus data mahasiswa ini?"
        type="danger"
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