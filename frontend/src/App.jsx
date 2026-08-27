import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardMhs from "./pages/user/DashboardMhs";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import KelolaPengajuan from "./pages/admin/KelolaPengajuan";
import KategoriSurat from "./pages/admin/Kategori";
import Setting from "./pages/admin/Settings";
import DataMahasiswa from "./pages/admin/DataMahasiswa";
import AjukanSurat from "./pages/user/AjukanSurat";
import RiwayatPengajuan from "./pages/user/RiwayatPengajuan";
import SettingMhs from "./pages/user/SettingMhs";

// Komponen Penjaga Rute (Protected Route)
const ProtectedRoute = ({ children, allowedRole }) => {
  // Menggunakan sessionStorage agar terisolasi per tab browser
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role'); 

  // 1. Jika belum login sama sekali, lempar ke halaman login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Jika role tidak sesuai dengan yang diizinkan, lempar ke halaman yang benar atau login
  if (allowedRole && userRole !== allowedRole) {
    // Jika admin mencoba buka halaman mahasiswa, arahkan ke dashboard admin
    if (userRole === 'admin') return <Navigate to="/ad/dashboard" replace />;
    // Jika mahasiswa mencoba buka halaman admin, arahkan ke dashboard mahasiswa
    if (userRole === 'mahasiswa') return <Navigate to="/mhs/dashboard" replace />;
    
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        
        {/* User / Mahasiswa (Hanya bisa diakses jika role == 'mahasiswa') */}
        <Route path="/mhs/dashboard" element={<ProtectedRoute allowedRole="mahasiswa"><DashboardMhs /></ProtectedRoute>} />
        <Route path="/mhs/ajukan" element={<ProtectedRoute allowedRole="mahasiswa"><AjukanSurat /></ProtectedRoute>} />
        <Route path="/mhs/riwayat" element={<ProtectedRoute allowedRole="mahasiswa"><RiwayatPengajuan /></ProtectedRoute>} />
        <Route path="/mhs/setting" element={<ProtectedRoute allowedRole="mahasiswa"><SettingMhs /></ProtectedRoute>} />
        
        {/* Admin (Hanya bisa diakses jika role == 'admin') */}
        <Route path="/ad/dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/ad/pengajuan" element={<ProtectedRoute allowedRole="admin"><KelolaPengajuan /></ProtectedRoute>} />
        <Route path="/ad/kategori" element={<ProtectedRoute allowedRole="admin"><KategoriSurat /></ProtectedRoute>} />
        <Route path="/ad/mahasiswa" element={<ProtectedRoute allowedRole="admin"><DataMahasiswa /></ProtectedRoute>} />
        <Route path="/ad/setting" element={<ProtectedRoute allowedRole="admin"><Setting /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;