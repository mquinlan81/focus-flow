import React, { useState } from 'react';

// Added setSecurity back into the props to fix the export/reference error
export default function Identity({
  setUsername,
  setSecurity,
  onComplete,
  onLoginSuccess,
}) {
  const [tempName, setTempName] = useState('');
  const [password, setPassword] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Renamed to errorMessage for clarity

  const handleCheckUser = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: tempName }),
      });
      const data = await response.json();

      if (data.exists) {
        setUserExists(true);
      } else {
        setUsername(tempName);
        onComplete();
      }
    } catch (err) {
      // Using 'err' in a console log or setting it to state fixes the "unused variable" error
      console.error('Connection Error:', err);
      setErrorMessage('Neural Link Failure: Backend Offline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: tempName, password: password }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Here we update security state so the app knows the current credentials
        setSecurity({ email: userData.email || '', password: password });
        onLoginSuccess(userData);
      } else {
        setErrorMessage('Invalid Security Credentials');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setErrorMessage('Login Protocol Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="space-y-2">
        <h2 className="text-ffwhite text-2xl font-bold italic tracking-tighter uppercase">
          {userExists ? 'Security Verification' : 'Neural Identity'}
        </h2>
        <p className="text-ffblue text-[10px] font-mono uppercase tracking-widest">
          {userExists
            ? 'Returning Operator Recognized'
            : 'Step 1: Establishing Origin'}
        </p>
      </div>

      <form
        onSubmit={userExists ? handleLogin : handleCheckUser}
        className="space-y-4"
      >
        <div>
          <label className="text-ffwhite/40 text-[10px] uppercase mb-1 block font-mono text-left">
            Neural Identifier
          </label>
          <input
            disabled={userExists || isLoading}
            type="text"
            placeholder="Username..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className={`w-full bg-ffblack border ${
              userExists
                ? 'border-ffblue/20 text-ffwhite/40'
                : 'border-ffblue/50'
            } rounded-lg p-3 text-ffwhite outline-none focus:border-ffblue transition-all`}
          />
        </div>

        {userExists && (
          <div className="animate-in slide-in-from-top duration-500 text-left">
            <label className="text-ffwhite/40 text-[10px] uppercase mb-1 block font-mono">
              Access Code
            </label>
            <input
              autoFocus
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ffblack border border-ffblue/50 rounded-lg p-3 text-ffwhite outline-none focus:border-ffblue transition-all"
            />
          </div>
        )}

        {errorMessage && (
          <p className="text-ffred text-[10px] font-mono uppercase">
            {errorMessage}
          </p>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-ffblue/10 hover:bg-ffblue/30 border border-ffblue/50 text-ffblue py-4 rounded-xl transition-all font-black uppercase tracking-[0.3em] text-[10px]"
        >
          {isLoading
            ? 'Processing...'
            : userExists
            ? 'Synchronize'
            : 'Scan Network'}
        </button>

        {userExists && (
          <button
            type="button"
            onClick={() => setUserExists(false)}
            className="w-full text-[9px] text-ffwhite/30 uppercase hover:text-ffblue transition-colors mt-2"
          >
            Not {tempName}? Create New Link
          </button>
        )}
      </form>
    </div>
  );
}
