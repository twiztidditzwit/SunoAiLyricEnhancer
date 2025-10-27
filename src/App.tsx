import React, { useState } from 'react';
import { Step1CoreIdea } from './components/wizard/Step1CoreIdea';
import { Step2Structure } from './components/wizard/Step2Structure';
import { Step3Details } from './components/wizard/Step3Details';
import { Step4Generate } from './components/wizard/Step4Generate';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CoreIdea state={appState} updateState={updateState} nextStep={nextStep} />;
      case 2:
        return <Step2Structure state={appState} updateState={updateState} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3Details state={appState} updateState={updateState} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4Generate state={appState} prevStep={prevStep} />;
      default:
        return <Step1CoreIdea state={appState} updateState={updateState} nextStep={nextStep} />;
    }
  };

  const progressPercentage = ((currentStep - 1) / 3) * 100;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-base-100 font-sans text-content-100">
      {/* Animated Background */}
      <div className="background-container -z-10">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-xl bg-base-200/80 p-6 shadow-2xl backdrop-blur-lg md:p-10">
          <header className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-4xl font-bold text-transparent animate-text-shimmer bg-400% md:text-5xl">
              Song Prompt Builder
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-content-200">
              A step-by-step guide to creating the perfect, detailed music prompt.
            </p>
          </header>

          {/* Progress Bar */}
          <div className="mb-8">
              <div className="relative h-2 rounded-full bg-base-300">
                  <div 
                      className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500 ease-out" 
                      style={{ width: `${progressPercentage}%`}}
                  ></div>
              </div>
              <div className="mt-2 grid grid-cols-4 text-center text-xs text-content-200">
                  <span className={currentStep >= 1 ? 'font-bold text-content-100' : ''}>Core Idea</span>
                  <span className={currentStep >= 2 ? 'font-bold text-content-100' : ''}>Structure</span>
                  <span className={currentStep >= 3 ? 'font-bold text-content-100' : ''}>Details</span>
                  <span className={currentStep >= 4 ? 'font-bold text-content-100' : ''}>Generate</span>
              </div>
          </div>
          
          <main>
            {renderStep()}
          </main>
        </div>
        <footer className="mt-8 text-center text-sm text-content-200">
          <p>Powered by Google Gemini. Built for creativity.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
