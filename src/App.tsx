import React, { useState, useCallback, useEffect } from 'react';
import { generateDetailedMusicPrompt } from './services/geminiService';
import { SUNO_PROMPT_MAX_LENGTH } from './constants';
import { checkForOverusedImagery } from './utils/feedbackUtils';
import { CharacterCounter } from './components/CharacterCounter';
import { OriginalityFeedback } from './components/OriginalityFeedback';
import { ClipboardIcon } from './components/icons/ClipboardIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { CheckIcon } from './components/icons/CheckIcon';

const App: React.FC = () => {
    const [lyrics, setLyrics] = useState<string>('');
    const [styleDescription, setStyleDescription] = useState<string>('');
    const [outputPrompt, setOutputPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [originalityFeedback, setOriginalityFeedback] = useState<string | null>(null);
    
    const apiKey = process.env.API_KEY;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!styleDescription.trim()) {
            setError('Please provide a style description.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setOutputPrompt('');
        setOriginalityFeedback(null);

        try {
            const detailedPrompt = await generateDetailedMusicPrompt(lyrics, styleDescription);
            setOutputPrompt(detailedPrompt);

            const feedback = checkForOverusedImagery(detailedPrompt);
            setOriginalityFeedback(feedback);

        } catch (err) {
            console.error(err);
            setError('Failed to generate prompt. Check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [lyrics, styleDescription]);
    
    const handleCopyPromptToClipboard = () => {
        if (outputPrompt && !isCopied) {
            navigator.clipboard.writeText(outputPrompt);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (!apiKey) {
        return (
          <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-2xl text-center bg-base-200 p-8 rounded-lg shadow-lg animate-fade-in-up">
              <h1 className="text-3xl font-bold text-red-400 mb-4">Configuration Error</h1>
              <p className="text-content-200 mb-6">
                The Gemini API key is missing. This application cannot function without it.
              </p>
              <p className="text-content-200">
                Please add your API key as an environment variable named <code className="bg-base-300 px-2 py-1 rounded-md text-yellow-300">API_KEY</code> in your Vercel project settings.
              </p>
              <a 
                href="https://vercel.com/docs/projects/environment-variables" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-6 inline-block bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors"
              >
                Learn how to add environment variables on Vercel
              </a>
            </div>
          </div>
        );
    }

    return (
        <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className={`max-w-7xl mx-auto transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <header className="text-center mb-8 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary bg-400% animate-text-shimmer">
                        Suno Prompt Enhancer
                    </h1>
                    <p className="mt-2 text-base sm:text-lg text-content-200">
                        Craft detailed Suno prompts by infusing your lyrics with AI-generated mixing instructions.
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="flex flex-col gap-6">
                        {/* INPUTS */}
                        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                             <label htmlFor="lyrics" className="block text-xl font-semibold mb-2">1. Add Lyrics (Optional)</label>
                             <p className="text-sm text-content-200 mb-3">Paste lyrics with sections like [Verse], [Chorus]. Leave blank to generate an instrumental track.</p>
                            <textarea
                                id="lyrics"
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                placeholder="[Intro]...[Verse]The rain falls...[Chorus]And I'm walking alone..."
                                className="w-full h-80 p-3 bg-base-300 rounded-md border border-transparent focus:ring-2 focus:ring-brand-primary focus:outline-none resize-y transition-shadow,border-color duration-200"
                            />
                        </div>

                        {/* SETTINGS */}
                         <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-2">2. Describe The Style</h2>
                            <p className="text-sm text-content-200 mb-3">Describe the genre, mood, and instrumentation. Be as simple or as detailed as you like.</p>
                            <textarea
                                id="style-description"
                                value={styleDescription}
                                onChange={(e) => setStyleDescription(e.target.value)}
                                placeholder="e.g., A sad, slow, acoustic ballad with female vocals and a lofi feel."
                                className="w-full h-32 p-3 bg-base-300 rounded-md border border-transparent focus:ring-2 focus:ring-brand-primary focus:outline-none resize-y transition-shadow,border-color duration-200"
                            />
                        </div>

                        {/* ACTION */}
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !styleDescription.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200"
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
                                Enhance Prompt
                                </>
                            )}
                        </button>
                    </div>

                    {/* OUTPUT */}
                    <div className="flex flex-col">
                         <div className="bg-base-200 p-6 rounded-lg shadow-lg flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold">Generated Suno Prompt</h2>
                                <button 
                                    onClick={handleCopyPromptToClipboard} 
                                    className={`flex items-center gap-2 text-sm py-1 px-3 rounded-md transition-all duration-200 ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-base-300 hover:bg-opacity-80'}`} 
                                    title="Copy to clipboard"
                                    disabled={isCopied || !outputPrompt}
                                >
                                    {isCopied ? (
                                        <>
                                            <CheckIcon />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <ClipboardIcon />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                           
                            {error && <p className="text-red-400 my-2">{error}</p>}
                            
                            <OriginalityFeedback message={originalityFeedback} />

                            <textarea
                                readOnly
                                value={outputPrompt}
                                placeholder="Your enhanced prompt will appear here..."
                                className="w-full flex-grow h-[40rem] p-3 bg-base-300 rounded-md border border-transparent focus:outline-none resize-none"
                            />
                            <div className="mt-2">
                                <CharacterCounter current={outputPrompt.length} max={SUNO_PROMPT_MAX_LENGTH} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;