import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-ffblack/90 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-ffblue border-t-transparent rounded-full animate-spin mb-6"></div>
      <div className="text-center space-y-2">
        <h2 className="text-ffwhite text-xl font-bold font-mono animate-pulse">
          INITIALIZING MATRIX
        </h2>
        <p className="text-ffblue text-xs uppercase tracking-[0.3em]">
          Syncing User Profile...
        </p>
      </div>
    </div>
  );
}
