import React from 'react';

const NeuralToggle = ({ options, active, onChange, counts }) => {
  return (
    <div className="flex bg-ffblack border border-ffblue/10 rounded-2xl p-1 w-full gap-1">
      {options.map((option) => {
        // Check if a count exists for this specific option
        const count = counts ? counts[option] : null;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`relative flex-1 py-2 rounded-xl font-inter text-[9px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${
              active === option
                ? 'bg-ffblue/20 text-ffblue border border-ffblue/30 shadow-[0_0_15px_rgba(0,186,255,0.1)]'
                : 'text-ffwhite/30 hover:text-ffwhite/60'
            }`}
          >
            {option}

            {/* CONDITIONAL RENDERING: Only show the badge if count exists and is > 0 */}
            {count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold ${
                  active === option
                    ? 'bg-ffblue text-ffblack'
                    : 'bg-ffwhite/10 text-ffwhite/40'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NeuralToggle;
