import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dummyData from '../../data/dummy.json';
import bgImage from '/assets/bg/bg.png';

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

  // Fungsi saat tombol Log In diklik
  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah form untuk me-refresh halaman

    // Ambil data dari JSON
    const adminAccount = dummyData.admin;
    const userAccount = dummyData.user;

    // Cek logika kredensial
    if (emailInput === adminAccount.email && passwordInput === adminAccount.password) {
      // Login sebagai Admin
      navigate('/ad/dashboard'); 
    } else if (emailInput === userAccount.email && passwordInput === userAccount.password) {
      // Login sebagai Mahasiswa
      navigate('/mhs/dashboard'); 
    } else {
      // Kalau salah masukkan peringatan
      setErrorMsg('Email atau password tidak cocok!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative p-4">
      
      {/* Background Blur Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Login Card (dengan efek border 3D ala desain) */}
      <div className="bg-white rounded-[24px] p-10 md:p-12 w-full max-w-[500px] z-10 relative border border-gray-200 border-r-[6px] border-b-[6px] border-r-[#D1D5DB] border-b-[#D1D5DB]">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[44px] leading-tight font-bold text-[#3169B3]">
            LOG IN
          </h1>
          <p className="text-[24px] leading-none font-medium text-[#3169B3]">
            untuk akses dashboard
          </p>
        </div>

        {/* Pesan Error (Muncul jika salah masukin sandi) */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Input Email ID */}
          <div className="flex items-stretch border-2 border-[#3169B3] rounded-xl overflow-hidden bg-transparent">
            <div className="px-5 py-3 border-r-2 border-[#3169B3] flex items-center justify-center">
              <MailIcon />
            </div>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email ID"
              className="flex-grow px-5 py-3 text-xl text-[#3169B3] placeholder:text-[#3169B3] outline-none bg-transparent font-medium"
            />
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-stretch border-2 border-[#3169B3] rounded-xl overflow-hidden bg-transparent">
              <div className="px-5 py-3 border-r-2 border-[#3169B3] flex items-center justify-center">
                <LockIcon />
              </div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
                className="flex-grow px-5 py-3 text-xl text-[#3169B3] placeholder:text-[#3169B3] outline-none bg-transparent font-medium"
              />
            </div>
            
            {/* Remember Me Checkbox (Menggantikan Lupa Password) */}
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