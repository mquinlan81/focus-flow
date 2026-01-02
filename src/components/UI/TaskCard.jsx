import React, { useState } from 'react';

const TaskCard = ({
  item,
  onMove,
  onDelete,
  onComplete,
  onMigrate,
  onReactivate,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Logic to see if the task is in the future
  const today = new Date().toISOString().split('T')[0];
  const isFuture = item.scheduled_date > today;

  return (
    <div
      className={`group ${
        isFuture
          ? 'bg-ffblack/60 border-ffwhite/10'
          : 'bg-ffblue/5 border-ffblue/10'
      } p-4 rounded-2xl hover:border-ffblue/30 transition-all animate-in slide-in-from-right duration-300`}
    >
      {/* Top Bar: Timestamp and Status */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-mono text-ffblue/60 uppercase">
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {/* NEW: Date Badge */}
          <span
            className={`text-[9px] font-bold tracking-widest uppercase ${
              isFuture ? 'text-ffyellow' : 'text-ffaqua'
            }`}
          >
            {isFuture ? `📅 ${item.scheduled_date}` : '⚡ Today'}
          </span>
        </div>

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
          {item.status === 'complete' ? (
            /* --- COMPLETED STATE: Show only Restore and Delete --- */
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => onReactivate(item.id)}
                  className="text-[10px] uppercase tracking-widest bg-ffgreen/10 hover:bg-ffgreen/20 text-ffgreen px-4 py-1 rounded border border-ffgreen/30 transition-all font-bold"
                >
                  RE-LINK NEURAL FLOW
                </button>
              </div>

              <div className="flex gap-4">
                {/* We keep the Delete button here so they can still purge completed tasks */}
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
            </>
          ) : (
            /* --- PENDING STATE: Your original logic --- */
            <>
              <div className="flex gap-1">
                <button
                  onClick={() => onMigrate(item.id, 1)} // Ensure this is a number 1
                  className="text-[10px] uppercase tracking-tighter bg-ffwhite/5 hover:bg-ffwhite/10 text-ffwhite/60 px-2 py-1 rounded border border-ffwhite/10 transition-colors"
                  title="Migrate to Tomorrow"
                >
                  Migrate →
                </button>

                {['Professional', 'Domestic', 'Personal'].map(
                  (t) =>
                    t !== item.theater && (
                      <button
                        key={t}
                        onClick={() => onMove(item.id, t)}
                        className="text-xs uppercase tracking-tighter bg-ffblue/10 hover:bg-ffblue/30 text-ffblue px-2 py-1 rounded border border-ffblue/20 transition-colors"
                      >
                        {t.slice(0, 3)}
                      </button>
                    )
                )}
              </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
