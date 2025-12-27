import React from 'react';

export default function Security({ security, onSecurityChange, onComplete }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation: ensure both fields have values
    if (security.email && security.password) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="space-y-2">
        <h2 className="text-[#d1faff] text-2xl font-bold">Neural Security</h2>
        <p className="text-[#0075a2] text-xs font-mono uppercase tracking-widest">
          Step 2: Encryption Protocols
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[#d1faff]/60 text-xs uppercase mb-1 block font-mono">
            Access Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="node@focusflow.ai"
            value={security.email}
            onChange={onSecurityChange}
            className="w-full bg-[#040f0f] border border-[#0075a2]/50 rounded-lg p-3 text-white outline-none focus:border-[#0075a2]"
            required
          />
        </div>

        <div>
          <label className="text-[#d1faff]/60 text-xs uppercase mb-1 block font-mono">
            Security Key
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={security.password}
            onChange={onSecurityChange}
            className="w-full bg-[#040f0f] border border-[#0075a2]/50 rounded-lg p-3 text-white outline-none focus:border-[#0075a2]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0075a2]/20 hover:bg-[#0075a2]/40 border border-[#0075a2]/50 text-[#d1faff] py-3 rounded-lg transition-all font-bold uppercase tracking-widest text-xs"
        >
          Authorize Calibration
        </button>
      </form>
    </div>
  );
}
