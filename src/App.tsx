// Fix: Implemented the main App component, state management, and UI.
import React, { useState, useMemo, useEffect } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { CharacterCounter } from './components/CharacterCounter';
import { OriginalityFeedback } from './components/OriginalityFeedback';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ClipboardIcon } from './components/icons/ClipboardIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import { generateLyrics } from './services/geminiService';
import { Settings, LyricRequest } from './types';
import { MAX_LYRICS_LENGTH, MAX_STYLE_LENGTH, MAX_STORY_LENGTH } from './constants';
import { checkForOverusedImagery } from './utils/feedbackUtils';

function App() {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('');
  const [story, setStory] = useState('');
  const [settings, setSettings] = useState<Settings>({
    mood: 'mellow',
    rhymeScheme: 'aabb',
    originality: 'somewhat-original',
  });
  
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const originalityFeedback = useMemo(() => {
    const combinedText = [lyrics, style, story].join(' ');
    return checkForOverusedImagery(combinedText);
  }, [lyrics, style, story]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedLyrics('');
    
    const request: LyricRequest = { lyrics, style, story, settings };
    
    try {
      const result = await generateLyrics(request);
      setGeneratedLyrics(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedLyrics) {
      navigator.clipboard.writeText(generatedLyrics);
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
    <div className="min-h-screen bg-base-100 text-content-100 font-sans">
      <div className="container mx-auto px-4 py-8 md:py-16">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent animate-text-shimmer bg-400%">
            LyricGen AI
          </h1>
          <p className="mt-4 text-lg text-content-200 max-w-2xl mx-auto">
            Your AI-powered songwriting partner. Refine your ideas, explore new styles, and break through creative blocks.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Song Concept</h2>
            
            <div>
              <label htmlFor="lyrics" className="block text-sm font-medium text-content-200">Draft Lyrics (optional)</label>
              <textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Verse 1: The city sleeps, but I'm awake..."
                className="mt-1 block w-full bg-base-200 rounded-md border-transparent focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition duration-300 h-32"
                maxLength={MAX_LYRICS_LENGTH}
              />
              <CharacterCounter current={lyrics.length} max={MAX_LYRICS_LENGTH} />
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-content-200">Style & Genre (optional)</label>
              <textarea
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., 'Indie folk with a touch of 70s rock', 'Modern pop with ethereal synths'"
                className="mt-1 block w-full bg-base-200 rounded-md border-transparent focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition duration-300 h-24"
                 maxLength={MAX_STYLE_LENGTH}
              />
              <CharacterCounter current={style.length} max={MAX_STYLE_LENGTH} />
            </div>

            <div>
              <label htmlFor="story" className="block text-sm font-medium text-content-200">Story or Theme (optional)</label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="e.g., 'A story about leaving a small town for a big city', 'A feeling of nostalgia for a lost summer love'"
                className="mt-1 block w-full bg-base-200 rounded-md border-transparent focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition duration-300 h-24"
                 maxLength={MAX_STORY_LENGTH}
              />
              <CharacterCounter current={story.length} max={MAX_STORY_LENGTH} />
            </div>

            <OriginalityFeedback message={originalityFeedback} />

            <SettingsPanel settings={settings} onSettingsChange={setSettings} />

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate Lyrics
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-base-200 p-6 rounded-lg shadow-lg relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-semibold mb-4">Generated Lyrics</h2>
            
            {isLoading && (
              <div className="absolute inset-0 bg-base-200 bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <SparklesIcon />
                  <p className="mt-2 text-content-200">Crafting your masterpiece...</p>
                </div>
              </div>
            )}

            {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-md">{error}</div>}

            {!isLoading && !generatedLyrics && !error && (
              <div className="text-center text-content-200 py-16">
                <p>Your AI-generated lyrics will appear here.</p>
              </div>
            )}
            
            {generatedLyrics && (
              <>
                <button
                  onClick={handleCopyToClipboard}
                  className="absolute top-4 right-4 p-2 rounded-md bg-base-300 hover:bg-brand-primary/50 text-content-200 hover:text-white transition-colors"
                  aria-label="Copy to clipboard"
                >
                  {copied ? <CheckIcon /> : <ClipboardIcon />}
                </button>
                <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-content-100">{generatedLyrics}</pre>
              </>
            )}
          </div>
        </main>

        <footer className="text-center mt-16 text-content-200 text-sm">
          <p>Powered by Google Gemini. Built for creativity.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;