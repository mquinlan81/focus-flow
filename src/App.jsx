import { useState } from 'react';
import Identity from './components/onboarding/Identity';
import Security from './components/onboarding/Security';
import Calibration from './components/onboarding/Calibration';
import LoadingScreen from './components/onboarding/LoadingScreen';
import Dashboard from './components/Dashboard';

function App() {
  const [profile, setProfile] = useState({
    profession: '',
    hq_location: '',
    primary_theater: 'Professional',
  });
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
      setStep(4);
    }, 3000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`${
          step === 4 ? 'w-full max-w-6xl' : 'w-full max-w-md'
        } bg-[#0075a2]/10 border border-[#0075a2] p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm transition-all duration-700`}
      >
        <h1 className="text-[#0075a2] text-3xl md:text-5xl font-bold tracking-tight mb-2">
          FocusFlow
        </h1>
        {step === 1 && (
          <Identity setUsername={setUsername} onComplete={() => setStep(2)} />
        )}
        {step === 2 && (
          <Security
            security={security}
            onSecurityChange={handleSecurityChange}
            onComplete={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Calibration
            profile={profile}
            setProfile={setProfile}
            onComplete={handleInitialize}
          />
        )}
        {step === 4 && <Dashboard user={username} profile={profile} />}

        {isAnalyzing && <LoadingScreen />}
      </div>
    </main>
  );
}

export default App;
