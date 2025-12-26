import { useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [security, setSecurity] = useState({ email: '', password: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInitialize = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#040f0f] flex items-center justify-center p-4">
      <div
        className={`${
          step === 3 ? 'w-full max-w-6xl' : 'w-full max-w-md'
        } bg-[#0075a2]/10 border border-[#0075a2] p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm transition-all duration-700`}
      >
        <h1 className="text-[#0075a2] text-3xl md:text-5xl font-bold tracking-tight mb-2">
          FocusFlow
        </h1>

        {/* STEP 1: NAME CAPTURE */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <h2 className="text-[#d1faff] text-2xl font-bold">
              What should I call you?
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full bg-[#040f0f] border border=[#0075a2]/50 rounded-lg p-4 text-white outline-none focus:border-[#0075a2]"
            />
            {username.length > 2 && (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#0075a2] text-white font-bold py-4 rounded-lg"
              >
                Continue to Security
              </button>
            )}
          </div>
        )}

        {/* STEP 2: SECURITY (EMAIL/PASS) */}
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-[#d1faff] text-2xl font-bold">
              Secure your Vault
            </h2>
            <div className="space-y-1">
              <label className="text-[#d1faff]/80 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={security.email}
                onChange={handleSecurityChange}
                className="w-full bg-[#040f0f] border border=[#0075a2]/50 rounded-lg p-4 text-white outline-none focus:border-[#0075a2]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#d1faff]/80 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={security.password}
                onChange={handleSecurityChange}
                className="w-full bg-[#040f0f] border border=[#0075a2]/50 rounded-lg p-4 text-white outline-none focus:border-[#0075a2]"
              />
            </div>

            {security.email.includes('@') && security.password.length >= 6 && (
              <button
                onClick={handleInitialize}
                className="w-full mt-4 bg-[#0075a2] text-white font-bold py-4 rounded-lg hover:shadow--[0_0_15px-rgba(0,117,0.5)] transition-all"
              >
                Complete Idenity
              </button>
            )}
            <button
              onClick={() => setStep(1)}
              className="text-[#d1faff]/40 text=xs hover:text-[#d1faff] block mx-auto"
            >
              Go Back
            </button>
          </div>
        )}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-[#040f0f] z-50 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#0075a2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#d1faff] font-mono animate-pulse">
              SYNCING NEURAL PROFILE...
            </p>
          </div>
        )}
        {/* STEP 3: THE MAIN DASHBOARD */}
        {step === 3 && <Dashboard user={username} />}
      </div>
    </div>
  );
}

export default App;
