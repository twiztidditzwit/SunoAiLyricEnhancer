import React, { useState, useEffect } from 'react';
import { AppState } from '../../types';
import { generateSunoPrompt } from '../../services/geminiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface Props {
  state: AppState;
  prevStep: () => void;
}

export const Step4Generate: React.FC<Props> = ({ state, prevStep }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    
    try {
      const result = await generateSunoPrompt(state);
      setGeneratedPrompt(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);


  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 4: Generate Your Prompt</h2>
      
      {!generatedPrompt && !isLoading && (
        <div className="text-center space-y-4">
            <p className="text-content-200">You've provided all the details. Ready to create your production-ready prompt?</p>
            <button
              onClick={handleGenerate}
              className="w-full max-w-xs mx-auto flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300"
            >
              <SparklesIcon />
              Generate Prompt
            </button>
        </div>
      )}
      
      {isLoading && (
        <div className="text-center text-content-200 py-16">
          <div className="flex justify-center items-center mb-4">
              <SparklesIcon />
          </div>
          <p>Synthesizing your creative vision...</p>
          <p className="text-sm">This may take a moment.</p>
        </div>
      )}

      {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-md">{error}</div>}

      {generatedPrompt && (
        <div className="relative">
          <button
            onClick={handleCopyToClipboard}
            className="absolute top-2 right-2 p-2 rounded-md bg-base-300 hover:bg-brand-primary/50 text-content-200 hover:text-white transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? <CheckIcon /> : <ClipboardIcon />}
          </button>
          <textarea
            readOnly
            value={generatedPrompt}
            className="w-full h-96 bg-base-300/50 rounded-lg p-4 font-mono text-sm border-transparent focus:border-brand-primary focus:ring-brand-primary/50"
          />
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={prevStep} className="py-2 px-6 bg-base-300 text-content-100 font-semibold rounded-lg hover:bg-base-300/70">
          Back
        </button>
        {generatedPrompt && 
            <button onClick={handleGenerate} className="py-2 px-6 bg-base-300 text-content-100 font-semibold rounded-lg hover:bg-base-300/70">
                Regenerate
            </button>
        }
      </div>
    </div>
  );
};
