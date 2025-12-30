import { useState } from 'react';
import Identity from './components/onboarding/Identity';
import Security from './components/onboarding/Security';
import Calibration from './components/onboarding/Calibration';
import LoadingScreen from './components/onboarding/LoadingScreen';
import Dashboard from './components/Dashboard';
import Logo from './components/UI/Logo';
import Header from './components/Header';
import SettingsView from './components/UI/SettingsView';

function App() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    legacyProfessions: [],
    work_address: '',
    home_address: '',
    primary_theater: 'Professional',
    energy_peak: 'Morning',
  });
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [security, setSecurity] = useState({ email: '', password: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

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

  const handleInitialize = async () => {
    setIsAnalyzing(true);

    const registrationData = {
      username: username,
      password: security.password,
      profession: profile.profession,
      legacyProfessions: profile.legacyProfessions,
    };

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        // Small delay for the "Analyzing" animation effect
        setTimeout(() => {
          setIsAnalyzing(false);
          setStep(4);
        }, 2000);
      } else {
        alert('Registration failed. Please check your connection.');
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setIsAnalyzing(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    // Set all the data we retrieved from the DB
    setUsername(userData.username);
    setProfile(userData.profile); // This fills your profession, etc.
    setStep(4); // Jump straight to the Matrix
  };

  return (
    <main
      className={`bg-ffblack min-h-screen flex justify-center p-4 ${
        step === 4 ? 'items-start pt-6' : 'items-center'
      }`}
    >
      {/* ONBOARDING CONTAINER (Steps 1-3) */}
      {step < 4 && (
        <div className="w-full max-w-md bg-ffblue/10 border border-ffblue p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm relative">
          <div className="flex justify-between items-center mb-8">
            <Logo />
            <div className="h-2 w-2 bg-ffgreen rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.5)]"></div>
          </div>

          {step === 1 && (
            <Identity
              setUsername={setUsername}
              setSecurity={setSecurity} // Ensure this is here!
              onComplete={() => setStep(2)}
              onLoginSuccess={handleLoginSuccess}
            />
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
        </div>
      )}

      {/* OPERATIONAL INTERFACE (Step 4) */}
      {step === 4 && (
        <div className="w-full max-w-6xl animate-in fade-in duration-700">
          <Header
            username={username}
            onOpenSettings={() => setCurrentView('settings')}
          />

          <div className="max-w-4xl mx-auto">
            {currentView === 'dashboard' ? (
              <Dashboard user={username} profile={profile} />
            ) : (
              <SettingsView
                profile={profile}
                setProfile={setProfile}
                security={security}
                setSecurity={setSecurity}
                username={username}
                onExit={() => setCurrentView('dashboard')}
              />
            )}
          </div>
        </div>
      )}

      {isAnalyzing && <LoadingScreen />}
    </main>
  );
}

export default App;
