import React, { useState } from 'react';
import { X, Plus, Shield, User as UserIcon } from 'lucide-react';

const SettingsView = ({
  profile,
  setProfile,
  security,
  setSecurity,
  username,
  onExit,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [newLegacy, setNewLegacy] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const addLegacy = () => {
    if (newLegacy.trim() && !profile.legacyProfessions.includes(newLegacy)) {
      setProfile({
        ...profile,
        legacyProfessions: [...profile.legacyProfessions, newLegacy.trim()],
      });
      setNewLegacy('');
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      {/* Tab Switcher */}
      <div className="flex bg-ffblack border border-ffblue/10 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl font-inter text-[10px] uppercase tracking-widest transition-all ${
            activeTab === 'profile'
              ? 'bg-ffblue/20 text-ffblue border border-ffblue/30'
              : 'text-ffwhite/30'
          }`}
        >
          User Profile
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 rounded-xl font-inter text-[10px] uppercase tracking-widest transition-all ${
            activeTab === 'settings'
              ? 'bg-ffblue/20 text-ffblue border border-ffblue/30'
              : 'text-ffwhite/30'
          }`}
        >
          System Settings
        </button>
      </div>

      <div className="bg-ffblue/5 border border-ffblue/20 p-8 rounded-3xl min-h-[500px] backdrop-blur-md">
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-ffblue/10 pb-4">
              <h2 className="text-ffwhite font-black text-xl tracking-tighter uppercase">
                Neural Identity
              </h2>
              <div className="text-right">
                <span className="block text-[8px] text-ffblue uppercase font-mono tracking-tighter">
                  Neural ID
                </span>
                <span className="text-ffwhite/40 font-mono text-sm uppercase">
                  {username}
                </span>
              </div>
            </div>

            {/* Identity Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-ffblue uppercase font-mono tracking-widest">
                  First Name
                </label>
                <input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className="w-full bg-ffblack/40 border border-ffblue/10 rounded-xl p-3 text-ffwhite text-sm focus:border-ffblue/40 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-ffblue uppercase font-mono tracking-widest">
                  Last Name
                </label>
                <input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className="w-full bg-ffblack/40 border border-ffblue/10 rounded-xl p-3 text-ffwhite text-sm focus:border-ffblue/40 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-ffblue uppercase font-mono tracking-widest">
                Email Address
              </label>
              <input
                value={security.email}
                onChange={(e) =>
                  setSecurity({ ...security, email: e.target.value })
                }
                className="w-full bg-ffblack/40 border border-ffblue/10 rounded-xl p-3 text-ffwhite text-sm focus:border-ffblue/40 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-ffblue/10 pt-4">
              <div className="space-y-1">
                <label className="text-[10px] text-ffblue uppercase font-mono tracking-widest">
                  Work Location
                </label>
                <input
                  value={profile.work_address}
                  onChange={(e) =>
                    setProfile({ ...profile, work_address: e.target.value })
                  }
                  className="w-full bg-ffblack/40 border border-ffblue/10 rounded-xl p-3 text-ffwhite text-sm focus:border-ffblue/40 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-ffblue uppercase font-mono tracking-widest">
                  Home Base
                </label>
                <input
                  value={profile.home_address}
                  onChange={(e) =>
                    setProfile({ ...profile, home_address: e.target.value })
                  }
                  className="w-full bg-ffblack/40 border border-ffblue/10 rounded-xl p-3 text-ffwhite text-sm focus:border-ffblue/40 outline-none transition-all"
                />
              </div>
            </div>

            {/* Profession & Legacy */}
            <div className="space-y-2 pt-4 border-t border-ffblue/10">
              <label className="text-[10px] text-ffaqua uppercase font-mono tracking-widest">
                Active Focus & Legacy
              </label>
              <input
                value={profile.profession}
                onChange={(e) =>
                  setProfile({ ...profile, profession: e.target.value })
                }
                className="w-full bg-ffblack/60 border border-ffaqua/20 rounded-xl p-3 text-ffwhite text-sm outline-none mb-3"
                placeholder="Primary Profession"
              />
              <div className="flex flex-wrap gap-2">
                {profile.legacyProfessions.map((exp, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-ffaqua/5 border border-ffaqua/20 px-3 py-1 rounded-full text-[10px] text-ffaqua"
                  >
                    {exp}
                    <button
                      onClick={() =>
                        setProfile({
                          ...profile,
                          legacyProfessions: profile.legacyProfessions.filter(
                            (p) => p !== exp
                          ),
                        })
                      }
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newLegacy}
                  onChange={(e) => setNewLegacy(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLegacy()}
                  className="flex-1 bg-transparent border-b border-ffblue/20 text-xs text-ffwhite/60 outline-none pb-1"
                  placeholder="Add legacy skill..."
                />
                <button onClick={addLegacy} className="text-ffaqua">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-ffwhite font-black text-xl tracking-tighter uppercase italic border-b border-ffblue/10 pb-4">
              System Config
            </h2>
            <div className="flex items-center justify-between p-4 bg-ffblack/20 rounded-2xl border border-ffblue/10">
              <div className="flex items-center gap-3">
                <Shield className="text-ffblue w-5 h-5" />
                <span className="text-ffwhite text-sm">
                  Security Level: High
                </span>
              </div>
              <span className="text-[10px] text-ffgreen uppercase font-mono font-bold">
                Encrypted
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onExit}
        className="group relative w-full py-5 bg-ffblue/10 border border-ffblue/40 rounded-2xl overflow-hidden hover:bg-ffblue/20 transition-all duration-300"
      >
        <span className="relative z-10 text-ffblue font-black text-[12px] uppercase tracking-[0.4em] group-hover:text-ffwhite transition-colors">
          Update Profile & Return to Matrix
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ffblue/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>

      <div className="pt-8 border-t border-ffwhite/10">
        {!isConfirming ? (
          <button
            onClick={() => setIsConfirming(true)}
            className="w-full py-4 border border-ffwhite/20 bg-ffwhite/5 text-ffwhite/60 font-inter font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:border-ffred/50 hover:text-ffred transition-all duration-300"
          >
            Terminate Neural Link [Logout]
          </button>
        ) : (
          <div className="flex gap-2 animate-in zoom-in-95 duration-200">
            <button
              onClick={onLogout}
              className="flex-[2] py-4 bg-ffred text-ffblack font-inter font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:brightness-110"
            >
              Confirm Termination
            </button>
            <button
              onClick={() => setIsConfirming(false)}
              className="flex-1 py-4 border border-ffwhite/20 text-ffwhite/40 font-inter font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-ffwhite/5"
            >
              Abort
            </button>
          </div>
        )}

        <p className="text-center text-[8px] font-mono text-ffwhite/20 mt-4 uppercase tracking-[0.2em]">
          {isConfirming
            ? 'CAUTION: Finalizing session wipe...'
            : 'Neural Session: Active'}
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
