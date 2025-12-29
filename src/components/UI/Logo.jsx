import React from 'react';

export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <div className="flex items-center">
      {/* This is a simple, modern geometric SVG using your brand colors */}
      <svg
        className={`${className} mr-3`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="10"
          className="text-ffaqua/50"
        />
        <path
          d="M30 50L45 65L70 35"
          stroke="var(--ffaqua)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_var(--ffaqua)]"
        />
        <rect
          x="45"
          y="45"
          width="10"
          height="10"
          fill="var(--ffyellow)"
          className="animate-pulse"
        />
      </svg>
      <h1 className="text-ffwhite font-inter font-black text-2xl tracking-tighter uppercase">
        Focus<span className="text-ffblue">Flow</span>
      </h1>
    </div>
  );
}
