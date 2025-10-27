import React, { useState } from 'react';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';
import { Step1CoreIdea } from './components/wizard/Step1CoreIdea';
import { Step2Structure } from './components/wizard/Step2Structure';
import { Step3Details } from './components/wizard/Step3Details';
import { Step4Generate } from './components/wizard/Step4Generate';

function App() {
  const [step, setStep] = useState(1);
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);

  const handleStateChange = (newState: Partial<AppState>) => {
    setAppState(prevState => ({ ...prevState, ...newState }));
  };
  
  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const restart = () => {
    setStep(1);
    setAppState(INITIAL_STATE);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1CoreIdea state={appState} onStateChange={handleStateChange} nextStep={nextStep} />;
      case 2:
        return <Step2Structure state={appState} onStateChange={handleStateChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3Details state={appState} onStateChange={handleStateChange} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4Generate state={appState} prevStep={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-base-100 min-h-screen text-content-100 font-sans">
      <div className="relative isolate min-h-screen">
          <div 
              className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" 
              aria-hidden="true"
          >
              <div 
                  className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" 
                  style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}
              ></div>
          </div>
          
          <main className="container mx-auto px-4 py-8 md:py-16">
              <header className="text-center mb-10">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-content-100">
                    Suno Prompt Wizard
                  </h1>
                  <p className="mt-4 text-lg text-content-200 max-w-2xl mx-auto">
                    Craft the perfect, production-ready prompt for your next AI-generated masterpiece.
                  </p>
              </header>

              <div className="max-w-3xl mx-auto bg-base-200/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-base-300/50 backdrop-blur-sm">
                {renderStep()}
              </div>

              {step === 4 && (
                <div className="text-center mt-8">
                  <button onClick={restart} className="text-brand-primary hover:text-brand-secondary transition-colors">Start Over</button>
                </div>
              )}

              <footer className="text-center mt-16 text-content-200 text-sm">
                  <p>Powered by Google Gemini</p>
              </footer>
          </main>
      </div>
    </div>
  );
}

export default App;