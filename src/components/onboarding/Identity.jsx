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
        <h2 className="text-ffwhite text-2xl font-bold">Neural Identity</h2>
        <p className="text-ffblue text-xs font-mono uppercase tracking-widest">
          Step 1: Establishing Origin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-ffwhite/60 text-xs uppercase mb-1 block">
            Designate User
          </label>
          <input
            autoFocus
            type="text"
            placeholder="Enter Username..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full bg-ffblack border border-ffblue/50 rounded-lg p-3 text-ffwhite outline-none focus:border-ffblue transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-ffblue/20 hover:bg-ffblue/40 border border-ffblue/50 text-ffwhite py-3 rounded-lg transition-all font-bold uppercase tracking-widest text-xs"
        >
          Initialize Security Protocol
        </button>
      </form>
    </div>
  );
}
