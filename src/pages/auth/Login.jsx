import React from 'react';
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
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative p-4">
      
      {/* Background Blur Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Login Card (dengan efek border 3D ala desain) */}
      <div className="bg-putih rounded-[24px] p-10 md:p-12 w-full max-w-[500px] z-10 relative border border-gray-200 border-r-[6px] border-b-[6px] border-r-[#D1D5DB] border-b-[#D1D5DB]">
        
        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-[44px] leading-tight font-bold text-biru">
            LOG IN
          </h1>
          <p className="text-[24px] leading-none font-medium text-biru">
            untuk akses dashboard
          </p>
        </div>

        <form className="space-y-6">
          
          {/* Input Email ID */}
          <div className="flex items-stretch border-2 border-biru rounded-xl overflow-hidden bg-transparent">
            <div className="px-5 py-3 border-r-2 border-biru flex items-center justify-center">
              <MailIcon />
            </div>
            <input
              type="email"
              placeholder="Email ID"
              className="flex-grow px-5 py-3 text-xl text-biru placeholder:text-biru outline-none bg-transparent font-regular"
            />
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-stretch border-2 border-biru rounded-xl overflow-hidden bg-transparent">
              <div className="px-5 py-3 border-r-2 border-biru flex items-center justify-center">
                <LockIcon />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="flex-grow px-5 py-3 text-xl text-biru placeholder:text-biru outline-none bg-transparent font-regular"
              />
            </div>
            
            {/* Lupa password text */}
            <div className="mt-3 text-left">
              <a href="#" className="text-[15px] font-medium text-birugelap hover:underline">
                Lupa password?
              </a>
            </div>
          </div>

          {/* Tombol LOG IN */}
          <div className="pt-8">
            <button
              type="submit"
              className="w-full bg-biru text-putih text-[28px] font-bold py-4 rounded-xl hover:bg-birugelap transition-colors tracking-wide"
            >
              LOG IN
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}