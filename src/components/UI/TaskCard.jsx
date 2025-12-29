import React, { useState } from 'react';

const TaskCard = ({ item, onMove, onDelete, onComplete }) => {
  // Local state to track if we are confirming a delete
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className="group bg-ffblue/5 border border-ffblue/10 p-4 rounded-2xl hover:border-ffblue/30 transition-all animate-in slide-in-from-right duration-300">
      {/* Top Bar: Timestamp and Priority */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[8px] font-mono text-ffblue/60 uppercase">
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <div className="flex gap-2">
          <span
            className={`text-[8px] font-mono px-2 py-0.5 rounded ${
              item.priority === 'High'
                ? 'bg-ffyellow/20 text-ffyellow'
                : 'bg-ffaqua/20 text-ffaqua'
            }`}
          >
            {item.priority}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-ffwhite text-sm font-medium mb-2">{item.content}</p>

      {/* AI Analysis Box */}
      <div className="bg-ffblack/40 p-2 rounded-lg border border-ffblue/5">
        <p className="text-[11px] text-ffwhite/50 italic leading-relaxed">
          {item.analysis}
        </p>

        {/* Action Row */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-ffblue/5">
          {/* Manual Move Controls */}
          <div className="flex gap-1">
            {['Professional', 'Domestic', 'Personal'].map(
              (t) =>
                t !== item.theater && (
                  <button
                    key={t}
                    onClick={() => onMove(item.id, t)}
                    className="text-xs uppercase tracking-tighter bg-ffblue/10 hover:bg-ffblue/30 text-ffblue px-2 py-1 rounded border border-ffblue/20 transition-colors"
                  >
                    To {t.slice(0, 3)}
                  </button>
                )
            )}
          </div>

          {/* Status Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => onComplete(item.id)}
              className="text-s text-ffgreen/60 hover:text-ffgreen transition-colors"
            >
              ✓
            </button>

            {isConfirmingDelete ? (
              <button
                onClick={() => onDelete(item.id)}
                className="text-s bg-ffred/20 text-ffred px-2 py-0.5 rounded animate-pulse"
              >
                Confirm?
              </button>
            ) : (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                className="text-s text-ffred/50 hover:text-ffred transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Reset confirmation if user leaves the card */}
          {isConfirmingDelete && (
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="text-s bg-white/10 text-ffwhite/30 px-2 py-0.5 rounded hover:text-ffwhite/50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
