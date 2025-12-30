import React from 'react';
import { Settings, Activity } from 'lucide-react';

// Change 'user' to 'username' here to match App.jsx
const Header = ({ username, onOpenSettings }) => {
  return (
    <div className="flex justify-between items-center border-b border-ffblue/20 pb-6 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-ffblue rounded-lg flex items-center justify-center font-black text-ffwhite text-xs">
          {/* Show the first letter of the username as a mini-avatar */}
          {username ? username[0].toUpperCase() : 'F'}
        </div>
        <div>
          <h1 className="font-inter font-black text-xl text-ffwhite tracking-tighter leading-none">
            FOCUS<span className="text-ffblue">FLOW</span>
          </h1>
          <p className="font-mono text-[8px] text-ffblue/60 uppercase tracking-widest mt-1">
            {/* Now we are USING the variable, which stops the error! */}
            Operator: {username || 'Guest'} // v1.0.4
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-ffblue/5 border border-ffblue/20 px-3 py-1.5 rounded-full">
          <Activity className="w-3 h-3 text-ffgreen animate-pulse" />
          <span className="font-mono text-[9px] text-ffwhite/70 uppercase">
            Link: Stable
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 hover:bg-ffblue/10 rounded-xl transition-colors text-ffwhite/50 hover:text-ffblue"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
