import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon Email Sesuai Desain (Garis Biru)
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#3169B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

// Icon Gembok Sesuai Desain (Garis Biru)
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#3169B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();

  // State untuk nyimpen inputan user
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fungsi saat tombol Log In diklik (SUDAH TERHUBUNG KE BACKEND)
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMsg(''); 

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      });

      const data = await response.json();

      if (response.ok) {
        // SIMPAN TOKEN & ROLE KE SESSION STORAGE
        sessionStorage.setItem('token', data.access_token);
        
        const userRole = data.role || (data.user && data.user.role); 
        sessionStorage.setItem('role', userRole); 
        
        if (userRole === 'admin') {
          navigate('/ad/dashboard'); 
        } else {
          navigate('/mhs/dashboard'); 
        }
      } else {
        setErrorMsg(data.pesan || data.message || 'Email atau password tidak cocok!');
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg('Gagal terhubung ke server backend! Pastikan XAMPP/Laragon menyala.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-putih overflow-hidden relative p-4">
      
      {/* Background SVG Doodle Surat yang Seamless (Berulang) */}
      <div className="absolute inset-0 z-0 opacity-[0.35]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="surat-doodle" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
              
              {/* Doodle Amplop Tertutup */}
              <g transform="translate(20, 30) rotate(-15)">
                <rect x="0" y="0" width="32" height="20" rx="2" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M0 0l16 12 16-12" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>

              {/* Doodle Pesawat Kertas */}
              <g transform="translate(85, 70) rotate(15)">
                <path d="M0 16l24-12-6 24-5-10-9-4z" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 4l-11 12" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
              </g>

              {/* Doodle Kertas Dokumen */}
              <g transform="translate(25, 100) rotate(10)">
                <rect x="0" y="0" width="22" height="28" rx="2" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8h10M6 14h10M6 20h6" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
              </g>

              {/* Elemen Coretan Pelengkap (Bintang/Garis Kecil) */}
              <path d="M100 20v6m-3-3h6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
              <path d="M50 75v4m-2-2h4" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
              <path d="M120 120a4 4 0 100-8 4 4 0 000 8z" fill="none" stroke="#94A3B8" strokeWidth="2"/>
            
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#surat-doodle)" />
        </svg>
      </div>

      {/* Login Card (dengan efek border 3D yang sangat pas dengan tema bg putih) */}
      <div className="bg-white rounded-[24px] p-10 md:p-12 w-full max-w-[500px] z-10 relative border border-gray-200 border-r-[6px] border-b-[6px] border-r-[#D1D5DB] border-b-[#D1D5DB] shadow-sm">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[44px] leading-tight font-bold text-[#3169B3]">
            LOG IN
          </h1>
          <p className="text-[24px] leading-none font-medium text-[#3169B3]">
            untuk akses dashboard
          </p>
        </div>

        {/* Pesan Error */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Input Email ID */}
          <div className="flex items-stretch border-2 border-[#3169B3] rounded-xl overflow-hidden bg-transparent">
            <div className="px-5 py-3 border-r-2 border-[#3169B3] flex items-center justify-center bg-white">
              <MailIcon />
            </div>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email ID"
              className="flex-grow px-5 py-3 text-xl text-[#3169B3] placeholder:text-[#3169B3] outline-none bg-white font-medium"
            />
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-stretch border-2 border-[#3169B3] rounded-xl overflow-hidden bg-transparent">
              <div className="px-5 py-3 border-r-2 border-[#3169B3] flex items-center justify-center bg-white">
                <LockIcon />
              </div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
                className="flex-grow px-5 py-3 text-xl text-[#3169B3] placeholder:text-[#3169B3] outline-none bg-white font-medium"
              />
            </div>
            
            {/* Remember Me Checkbox */}
            <div className="mt-4 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#3169B3] bg-gray-100 border-gray-300 rounded focus:ring-[#3169B3] cursor-pointer"
              />
              <label htmlFor="remember" className="text-[15px] font-medium text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
          </div>

          {/* Tombol LOG IN */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#3169B3] text-white text-[28px] font-bold py-4 rounded-xl hover:bg-[#204a82] transition-colors tracking-wide shadow-md"
            >
              LOG IN
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}