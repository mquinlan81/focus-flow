import React, { useState } from 'react';

export default function Calibration({
  username,
  security,
  profile,
  setProfile,
  onComplete,
}) {
  // Local state for UI-only toggles (don't need to save these to DB)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const getGPSLocation = (targetField) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setProfile((prev) => ({
        ...prev,
        [targetField]: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verification check
    if (profile.firstName && profile.profession && profile.work_address) {
      onComplete();
    } else {
      alert(
        'Neural Baseline Incomplete: Please verify Name, Profession, and Work HQ.'
      );
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom duration-700 max-w-[450px] mx-auto pb-10">
      {/* HEADER */}
      <div className="border-b border-ffblue/30 pb-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-inter font-black text-xl text-ffwhite uppercase tracking-tighter">
            Final Verification
          </h2>
          <span className="text-[10px] font-mono text-ffaqua bg-ffaqua/10 px-2 py-0.5 rounded border border-ffaqua/20">
            ID: {username || 'UNRESOLVED'}
          </span>
        </div>
        <p className="font-poppins text-[10px] text-ffblue uppercase tracking-widest">
          Confirm System Parameters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ACCOUNT INFO (Read Only or Sync'd)
        <div className="grid grid-cols-2 gap-3 bg-ffblue/5 p-3 rounded-xl border border-ffblue/10">
          <div className="space-y-1">
            <label className="font-inter text-[9px] uppercase font-bold text-ffblue/60 tracking-widest">
              System Email
            </label>
            <p className="text-xs font-poppins text-ffwhite truncate">
              {security.email}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <label className="font-inter text-[9px] uppercase font-bold text-ffblue/60 tracking-widest">
              Username
            </label>
            <p className="text-xs font-poppins text-ffwhite">{username}</p>
          </div>
        </div> */}

        {/* EMAIL BLOCK */}
        <div className="space-y-1">
          <label className="font-inter text-[9px] uppercase font-bold text-ffblue tracking-widest">
            System Email
          </label>
          <input
            name="email"
            required
            className="w-full bg-ffblack border border-ffblue/20 p-2.5 text-ffwhite rounded-lg outline-none focus:border-ffblue text-sm"
            value={security.email}
            onChange={handleChange}
          />
        </div>

        {/* USERNAME BLOCK */}
        <div className="space-y-1">
          <label className="font-inter text-[9px] uppercase font-bold text-ffblue tracking-widest">
            Username
          </label>
          <input
            name="username"
            required
            className="w-full bg-ffblack border border-ffblue/20 p-2.5 text-ffwhite rounded-lg outline-none focus:border-ffblue text-sm"
            value={username}
            onChange={handleChange}
          />
        </div>

        {/* NAME BLOCK */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-inter text-[9px] uppercase font-bold text-ffblue tracking-widest">
              First Name
            </label>
            <input
              name="firstName"
              required
              className="w-full bg-ffblack border border-ffblue/20 p-2.5 text-ffwhite rounded-lg outline-none focus:border-ffblue text-sm"
              value={profile.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="font-inter text-[9px] uppercase font-bold text-ffblue tracking-widest">
              Last Name
            </label>
            <input
              name="lastName"
              className="w-full bg-ffblack border border-ffblue/20 p-2.5 text-ffwhite rounded-lg outline-none focus:border-ffblue text-sm"
              value={profile.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ROLE BLOCK */}
        <div className="space-y-1">
          <label className="font-inter text-[9px] uppercase font-bold text-ffblue tracking-widest">
            Professional Archetype
          </label>
          <input
            name="profession"
            required
            className="w-full bg-ffblack border border-ffblue/20 p-2.5 text-ffwhite rounded-lg outline-none focus:border-ffblue text-sm"
            value={profile.profession}
            onChange={handleChange}
          />
        </div>

        {/* GEOLOCATION BLOCK */}
        <div className="space-y-4 pt-2">
          {['work_address', 'home_address'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="font-inter text-[9px] uppercase font-bold text-ffaqua tracking-widest">
                {field.replace('_', ' ')}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-ffaqua/50 text-xs">
                  🔍
                </span>
                <input
                  name={field}
                  placeholder={`Search ${field.split('_')[0]}...`}
                  className="w-full bg-ffblack border border-ffaqua/20 pl-9 pr-12 py-3 text-ffwhite rounded-xl text-xs outline-none focus:border-ffaqua"
                  value={profile[field]}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => getGPSLocation(field)}
                  className="absolute right-2 p-1.5 rounded-lg bg-ffaqua/10 text-ffaqua hover:bg-ffaqua/20 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PASSWORD BLOCK (with Reveal) */}
        <div className="mt-4">
          <label className="font-inter text-[9px] uppercase font-bold text-ffyellow tracking-widest block mb-1">
            Neural Security Key
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-ffyellow/50 text-xs">🔒</span>
            <input
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              readOnly // To prevent accidental changes here since it was set in Step 2
              className="w-full bg-ffblack border border-ffyellow/20 pl-9 pr-12 py-3 text-ffwhite rounded-xl text-xs outline-none opacity-80"
              value={security.password}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-2 p-1.5 rounded-lg bg-ffyellow/10 text-ffyellow hover:bg-ffyellow/20 transition-all"
            >
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className={`w-full mt-6 ${
            profile.firstName &&
            profile.profession &&
            username &&
            security.password &&
            security.email
              ? 'bg-ffblue/30 text-ffwhite'
              : 'bg-ffyellow/50 text-ffyellow/80'
          } border border-ffblue font-inter font-black uppercase text-xs tracking-[0.3em] py-4 rounded-xl hover:bg-ffblue hover:text-ffwhite transition-all shadow-lg shadow-ffblue/10`}
        >
          Initialize Neural Matrix
        </button>
      </form>
    </div>
  );
}
