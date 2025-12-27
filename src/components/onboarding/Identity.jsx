import React, { useState } from 'react';

export default function Identity({ setUsername, onComplete }) {
  const [tempName, setTempName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName);
      onComplete();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="space-y-2">
        <h2 className="text-[#d1faff] text-2xl font-bold">Neural Identity</h2>
        <p className="text-[#0075a2] text-xs font-mono uppercase tracking-widest">
          Step 1: Establishing Origin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[#d1faff]/60 text-xs uppercase mb-1 block">
            Designate User
          </label>
          <input
            autoFocus
            type="text"
            placeholder="Enter Username..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full bg-[#040f0f] border border-[#0075a2]/50 rounded-lg p-3 text-white outline-none focus:border-[#0075a2] transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0075a2]/20 hover:bg-[#0075a2]/40 border border-[#0075a2]/50 text-[#d1faff] py-3 rounded-lg transition-all font-bold uppercase tracking-widest text-xs"
        >
          Initialize Security Protocol
        </button>
      </form>
    </div>
  );
}
