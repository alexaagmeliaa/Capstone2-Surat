import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* User */}
        <Route path="/mhs/dashboard" element={<DashboardMhs />} />
        <Route path="/mhs/ajukan" element={<AjukanSurat />} />
        <Route path="/mhs/riwayat" element={<RiwayatPengajuan />} />
        <Route path="/mhs/setting" element={<SettingMhs />} />
        
        {/* Admin */}
        <Route path="/ad/dashboard" element={<DashboardAdmin />} />
        <Route path="/ad/pengajuan" element={<KelolaPengajuan />} />
        <Route path="/ad/kategori" element={<KategoriSurat />} />
        <Route path="/ad/mahasiswa" element={<DataMahasiswa />} />
        <Route path="/ad/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;