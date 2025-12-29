{/* STEP 1: NAME CAPTURE
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <h2 className="text-ffwhite text-2xl font-bold">
              What should I call you?
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full bg-ffblack border border=ffblue/50 rounded-lg p-4 text-ffwhite outline-none focus:border-ffblue"
            />
            {username.length > 2 && (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-ffblue text-ffwhite font-bold py-4 rounded-lg"
              >
                Continue to Security
              </button>
            )}
          </div>
        )} */}

        {/* STEP 2: SECURITY (EMAIL/PASS)
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-ffwhite text-2xl font-bold">
              Secure your Vault
            </h2>
            <div className="space-y-1">
              <label className="text-ffwhite/80 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={security.email}
                onChange={handleSecurityChange}
                className="w-full bg-ffblack border border=ffblue/50 rounded-lg p-4 text-ffwhite outline-none focus:border-ffblue"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ffwhite/80 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={security.password}
                onChange={handleSecurityChange}
                className="w-full bg-ffblack border border=ffblue/50 rounded-lg p-4 text-ffwhite outline-none focus:border-ffblue"
              />
            </div>

            {security.email.includes('@') && security.password.length >= 6 && (
              <button
                onClick={() => setStep(3)}
                className="w-full mt-4 bg-ffblue text-ffwhite font-bold py-4 rounded-lg hover:shadow--[0_0_15px-rgba(0,117,0.5)] transition-all"
              >
                Complete Idenity
              </button>
            )}
            <button
              onClick={() => setStep(1)}
              className="text-ffwhite/40 text=xs hover:text-ffwhite block mx-auto"
            >
              Go Back
            </button>
          </div>
        )}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-ffblack z-50 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-ffblue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-ffwhite font-mono animate-pulse">
              SYNCING NEURAL PROFILE...
            </p>
          </div>
        )} */}

        {/* STEP 3: ENVIRONMENT CALIBRATION */}
        {/* {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
            <div className="border-b border-ffblue/30 pb-4">
              <h2 className="text-ffwhite text-2xl font-bold font-mono tracking-tighter">
                NEURAL CALIBRATION
              </h2>
              <p className="text-ffblue text-[10px] uppercase tracking-[0.2em]">
                Establishing User Baseline
              </p>
            </div>

            <div className="space-y-5">

              {/* PROFESSION: This solves the 'Property Manager' vs 'Homeowner' puzzle */}
              {/* <div>
                <label className="text-ffwhite/60 text-[10px] uppercase mb-1 block font-mono">
                  Professional Identity
                </label>
                <input
                  type="text"
                  placeholder="e.g. Property Manager, Software Engineer..."
                  className="w-full bg-ffblack border border-ffblue/40 rounded-lg p-3 text-ffwhite outline-none focus:border-ffblue placeholder-ffblue/30"
                  onChange={(e) =>
                    setProfile({ ...profile, profession: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-ffwhite/60 text-[10px] uppercase mb-1 block font-mono">
                  Base of Operations (City/Zip)
                </label>
                <input
                  type="text"
                  placeholder="Where is your physical HQ?"
                  className="w-full bg-ffblack border border-ffblue/40 rounded-lg p-3 text-ffwhite outline-none focus:border-ffblue placeholder-ffblue/30"
                  onChange={(e) =>
                    setProfile({ ...profile, hq_location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-ffwhite/60 text-[10px] uppercase mb-1 block font-mono">
                  Current Priority
                </label>
                <select
                  className="w-full bg-ffblack border border-ffblue/40 rounded-lg p-3 text-ffwhite outline-none appearance-none"
                  onChange={(e) =>
                    setProfile({ ...profile, primary_theater: e.target.value })
                  }
                >
                  <option value="Professional">
                    Professional / Career Advancement
                  </option>
                  <option value="Domestic">
                    Domestic / Household Management
                  </option>
                  <option value="Personal">
                    Personal Growth / Side-Quests
                  </option>
                </select>
              </div>
            </div>

            <button
              onClick={handleInitialize}
              className="w-full bg-transparent border border-ffblue text-ffblue hover:bg-ffblue hover:text-ffwhite font-bold py-4 rounded-lg transition-all duration-500 uppercase text-xs tracking-widest"
            >
              Finalize System Integration
            </button>
          </div> */}
        {/* )} */} */}

        {/* STEP 4: THE MAIN DASHBOARD */}
        {/* {step === 4 && <Dashboard user={username} profile={profile} />}
      </div>
    </div> */}