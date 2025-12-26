import { useEffect, useRef, useState } from 'react';

export default function Dashboard({ user }) {
  const inputRef = useRef(null);
  const [task, setTask] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleAnalyze = () => {
    if (!task) return;
    setIsAnalyzing(true);

    // Simulate the ML processing time
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult('High Priority: Deep Work Protocol Suggested.');
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-1000">
      <header className="flex justify-between items-center mb-8 border-b border-[#0075a2]/30 pb-4">
        <div>
          <h2 className="text-[#d1faff]/80 text-sm font-mono uppercase tracking-widest">
            System Active
          </h2>
          <h1 className="text-2xl font-bold text-white">Welcome, {user}</h1>
        </div>
        <div className="text-right">
          <p className="text-[#0075a2] font-bold text-xl">100%</p>
          <p className="text-[#d1faff]/40 text-xs uppercase">Focus Battery</p>
        </div>
      </header>

      {/* THE MAIN GRID CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="bg-[#0075a2]/5 border border-[#0075a2]/20 p-4 md:p-6 rounded-xl">
          <h3 className="text-[#d1faff] font-bold mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#0075a2] rounded-full mr-2 animate-pulse"></span>
            Neural Task Input
          </h3>
          <textarea
            placeholder="What is the primary objective for this session?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            ref={inputRef}
            className="w-full h-32 bg-[#040f0f] border border-[#0075a2]/30 rounded-lg p-4 text-white placeholder-[#d1faff]/35 outline-none focus:border-[#0075a2] transition-all resize-none font-mono text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !task}
            className="mt-4 w-full py-2 bg-[#0075a2]/20 hover:bg-[#0075a2]/40 border border-[#0075a2]/50 text-[#d1faff] text-xs uppercase tracking-widest font-bold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Processing...' : 'Analyze Priority'}
          </button>
        </div>

        {/* Right Column: AI Feedback */}
        <div className="bg-[#0075a2]/5 border border-[#0075a2]/20 p-4 md:p-6 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="text-[#0075a2] text-xs font-mono mb-2 uppercase tracking-tighter">
            AI Assessment
          </div>

          {isAnalyzing ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-[#d1faff] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-[#d1faff]/60 text-xs animate-pulse font-mono">
                Running ML Model...
              </p>
            </div>
          ) : (
            <p className="text-[#d1faff]/80 text-sm italic leading-relaxed">
              {analysisResult || 'Waiting for neural input...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
