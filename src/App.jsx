import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardMhs from "./pages/user/DashboardMhs";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import KelolaPengajuan from "./pages/admin/KelolaPengajuan";
import KategoriSurat from "./pages/admin/Kategori";
import DataMahasiswa from "./pages/admin/DataMahasiswa";
import Setting from "./pages/admin/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        
        {/* User */}
        <Route path="/u/dashboard" element={<DashboardMhs />} />
        
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