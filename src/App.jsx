import { useState } from 'react';
import Identity from './components/onboarding/Identity';
import Security from './components/onboarding/Security';
import Calibration from './components/onboarding/Calibration';
import LoadingScreen from './components/onboarding/LoadingScreen';
import Dashboard from './components/Dashboard';
import Logo from './components/UI/Logo';

function App() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    work_address: '',
    home_address: '',
    primary_theater: 'Professional',
    energy_peak: 'Morning',
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

  // const [theme, setTheme] = useState(
  //   window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  // );

  // const toggleTheme = () => {
  //   const newTheme = theme === 'dark' ? 'light' : 'dark';
  //   setTheme(newTheme);
  //   document.documentElement.setAttribute('data-theme', newTheme);
  // };

  const handleInitialize = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(4);
    }, 3000);
  };

  return (
    <main className="bg-ffblack min-h-screen flex items-center justify-center p-4">
      <div
        className={`${
          step === 4 ? 'w-full max-w-6xl' : 'w-full max-w-md'
        } bg-ffblue/10 border border-ffblue p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm transition-all duration-700`}
      >
        <header className="flex justify-between items-center mb-8">
          <Logo />
          {/* This is a great place to put the Theme Toggle later! */}
          <div className="h-2 w-2 bg-ffgreen rounded-full animate-pulse shadow-[0_0_8px_var(--ffgreen)]"></div>
        </header>

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
            username={username}
            security={security}
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
