import React from 'react';

export default function Calibration({ profile, setProfile, onComplete }) {
  // Helper function to update specific fields in the profile object
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure the profession is filled out at minimum to avoid AI confusion
    if (profile.profession && profile.hq_location) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="border-b border-[#0075a2]/30 pb-4">
        <h2 className="text-[#d1faff] text-2xl font-bold font-mono tracking-tighter uppercase">
          Neural Calibration
        </h2>
        <p className="text-[#0075a2] text-[10px] uppercase tracking-[0.2em]">
          Step 3: Establishing User Baseline
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-[#d1faff]/60 text-[10px] uppercase mb-1 block font-mono">
            Professional Identity
          </label>
          <input
            type="text"
            name="profession"
            placeholder="e.g. Property Manager, Developer..."
            value={profile.profession}
            onChange={handleChange}
            className="w-full bg-[#040f0f] border border-[#0075a2]/40 rounded-lg p-3 text-white outline-none focus:border-[#0075a2] placeholder-[#0075a2]/30 transition-all"
            required
          />
        </div>

        <div>
          <label className="text-[#d1faff]/60 text-[10px] uppercase mb-1 block font-mono">
            Base of Operations (City/Zip)
          </label>
          <input
            type="text"
            name="hq_location"
            placeholder="Where is your physical HQ?"
            value={profile.hq_location}
            onChange={handleChange}
            className="w-full bg-[#040f0f] border border-[#0075a2]/40 rounded-lg p-3 text-white outline-none focus:border-[#0075a2] placeholder-[#0075a2]/30 transition-all"
            required
          />
        </div>

        <div>
          <label className="text-[#d1faff]/60 text-[10px] uppercase mb-1 block font-mono">
            Current Priority Theater
          </label>
          <select
            name="primary_theater"
            value={profile.primary_theater}
            onChange={handleChange}
            className="w-full bg-[#040f0f] border border-[#0075a2]/40 rounded-lg p-3 text-white outline-none appearance-none cursor-pointer focus:border-[#0075a2]"
          >
            <option value="Professional">
              Professional / Career Advancement
            </option>
            <option value="Domestic">Domestic / Household Management</option>
            <option value="Personal">Personal Growth / Side-Quests</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-transparent border border-[#0075a2] text-[#0075a2] hover:bg-[#0075a2] hover:text-white font-bold py-4 rounded-lg transition-all duration-500 uppercase text-xs tracking-widest"
        >
          Finalize System Integration
        </button>
      </form>
    </div>
  );
}
