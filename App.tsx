import React, { useState, useCallback, useEffect } from 'react';
import { generateMixingPhrases, generateSongStyle, expandLyrics, generateStoryFromLyrics } from './services/geminiService';
import { AppSettings } from './types';
import { SUNO_PROMPT_MAX_LENGTH, STYLE_MAX_LENGTH, FEEL_OPTIONS, MOOD_OPTIONS, SPEED_OPTIONS, VOCAL_STYLE_OPTIONS, LYRIC_EXPANSION_THRESHOLD, MASTERING_STYLE_OPTIONS } from './constants';
import { checkForOverusedImagery } from './utils/feedbackUtils';
import { SettingsPanel } from './components/SettingsPanel';
import { CharacterCounter } from './components/CharacterCounter';
import { OriginalityFeedback } from './components/OriginalityFeedback';
import { ClipboardIcon } from './components/icons/ClipboardIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { CheckIcon } from './components/icons/CheckIcon';

const App: React.FC = () => {
    const [lyrics, setLyrics] = useState<string>('');
    const [finalStyleContent, setFinalStyleContent] = useState<string>('');
    const [settings, setSettings] = useState<AppSettings>({
        feel: FEEL_OPTIONS[0],
        mood: MOOD_OPTIONS[0],
        speed: SPEED_OPTIONS[2],
        vocalStyle: VOCAL_STYLE_OPTIONS[0],
        instrumentation: [],
        autoExpand: true,
        mastering: MASTERING_STYLE_OPTIONS[0],
        storyMode: false,
        storyPrompt: '',
    });
    const [outputPrompt, setOutputPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isStyleCopied, setIsStyleCopied] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [originalityFeedback, setOriginalityFeedback] = useState<string | null>(null);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setOutputPrompt('');
        setFinalStyleContent('');
        setOriginalityFeedback(null);

        try {
            const rawStyle = await generateSongStyle(settings.feel, settings.mood, settings.speed, settings.vocalStyle, settings.instrumentation, settings.mastering);
            const newSongStyle = rawStyle.split(',').map(s => s.trim()).join(' | ');

            let currentLyrics = lyrics;
            const lyricsAreMissing = currentLyrics.trim().length < LYRIC_EXPANSION_THRESHOLD && !currentLyrics.includes('[Verse]');

            if (settings.autoExpand && lyricsAreMissing) {
                const expanded = await expandLyrics(rawStyle, currentLyrics);
                setLyrics(expanded); // Update UI so user sees the generated lyrics
                currentLyrics = expanded;
            }

            let storyContent = '';
            if (settings.storyMode) {
                storyContent = await generateStoryFromLyrics(currentLyrics, rawStyle, settings.storyPrompt);
            }
            const storyBlock = storyContent ? `${storyContent}\n\n` : '';

            const phrases = await generateMixingPhrases(settings.feel, settings.mood, settings.speed, settings.vocalStyle, settings.instrumentation, settings.mastering);
            if (!phrases.length) {
                const finalPromptContent = `[Style: ${newSongStyle}]\n${storyBlock}${currentLyrics}`.slice(0, SUNO_PROMPT_MAX_LENGTH);
                setFinalStyleContent(newSongStyle.slice(0, STYLE_MAX_LENGTH));
                setOutputPrompt(finalPromptContent);
                setIsLoading(false);
                return;
            }

            let shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5);
            let phraseIndex = 0;
            const getNextPhrase = () => {
                if (phraseIndex >= shuffledPhrases.length) phraseIndex = 0;
                return shuffledPhrases[phraseIndex++];
            };
            
            const lyricTokens = currentLyrics.split(/(\[.*?\])/g).filter(Boolean).map(part => ({
                isTag: part.startsWith('[') && part.endsWith(']'),
                value: part,
            }));

            const sections: { label: string; content: string; contentLength: number }[] = [];
            let contentBeforeFirstTag = '';
            if (lyricTokens.length > 0 && !lyricTokens[0].isTag) {
                contentBeforeFirstTag = lyricTokens.shift()!.value;
            }
            
            for (let i = 0; i < lyricTokens.length; i++) {
                if (lyricTokens[i].isTag) {
                    const nextToken = lyricTokens[i + 1];
                    const content = (nextToken && !nextToken.isTag) ? nextToken.value : '';
                    sections.push({
                        label: lyricTokens[i].value,
                        content: content,
                        contentLength: content.trim().length,
                    });
                }
            }

            const initialPromptForSizing = `${contentBeforeFirstTag}[Style: ${newSongStyle}]\n${storyBlock}${currentLyrics}`;
            const spaceToFill = SUNO_PROMPT_MAX_LENGTH - initialPromptForSizing.length;
            
            if (spaceToFill <= 0 || sections.length === 0) {
                 setOutputPrompt(initialPromptForSizing.slice(0, SUNO_PROMPT_MAX_LENGTH));
                 setFinalStyleContent(newSongStyle.slice(0, STYLE_MAX_LENGTH));
            } else {
                const totalContentLength = sections.reduce((sum, s) => sum + s.contentLength, 0);
                const enhancedLabelsMap = new Map<string, string>();

                sections.forEach(section => {
                    let spaceForThisSection: number;

                    if (totalContentLength > 0) {
                        const proportion = section.contentLength / totalContentLength;
                        spaceForThisSection = Math.floor(spaceToFill * proportion * 0.7);
                    } else {
                        spaceForThisSection = Math.floor(spaceToFill / sections.length * 0.7);
                    }

                    let newLabelContent = section.label.slice(1, -1);
                    let currentExtraLength = 0;

                    while (currentExtraLength < spaceForThisSection) {
                        const phrase = getNextPhrase();
                        const potentialAdd = ` | ${phrase}`;
                        if (currentExtraLength + potentialAdd.length > spaceForThisSection) {
                            break; 
                        }
                        newLabelContent += potentialAdd;
                        currentExtraLength += potentialAdd.length;
                    }
                    enhancedLabelsMap.set(section.label, `[${newLabelContent}]`);
                });
                
                const enhancedLyrics = lyricTokens.map(token => {
                    if (token.isTag && enhancedLabelsMap.has(token.value)) {
                        return enhancedLabelsMap.get(token.value);
                    }
                    return token.value;
                }).join('');
                
                let tempPrompt = `[Style: ${newSongStyle}]\n${storyBlock}${contentBeforeFirstTag}${enhancedLyrics}`;
                const targetLength = SUNO_PROMPT_MAX_LENGTH * 0.97;
                let paddingNeeded = targetLength - tempPrompt.length;
                
                let paddedStyleContent = newSongStyle;
                while (paddingNeeded > 0) {
                    const phrase = getNextPhrase();
                    const potentialAdd = ` | ${phrase}`;
                    if (potentialAdd.length > paddingNeeded || (paddedStyleContent.length + potentialAdd.length) >= STYLE_MAX_LENGTH) {
                        break;
                    }
                    paddedStyleContent += potentialAdd;
                    paddingNeeded -= potentialAdd.length;
                }
                setFinalStyleContent(paddedStyleContent);

                const finalStylePrompt = `[Style: ${paddedStyleContent}]`;
                let finalPrompt = `${finalStylePrompt}\n${storyBlock}${contentBeforeFirstTag}${enhancedLyrics}`;
                
                if (finalPrompt.length > SUNO_PROMPT_MAX_LENGTH) {
                    finalPrompt = finalPrompt.slice(0, SUNO_PROMPT_MAX_LENGTH);
                }
                
                setOutputPrompt(finalPrompt);
            }

            // Originality check
            const combinedTextForCheck = [currentLyrics, newSongStyle, storyContent].join(' ');
            const feedback = checkForOverusedImagery(combinedTextForCheck);
            setOriginalityFeedback(feedback);

        } catch (err) {
            console.error(err);
            setError('Failed to generate prompt. Check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [lyrics, settings]);
    
    const handleCopyPromptToClipboard = () => {
        if (outputPrompt && !isCopied) {
            navigator.clipboard.writeText(outputPrompt);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleCopyStyleToClipboard = () => {
        if (finalStyleContent && !isStyleCopied) {
            navigator.clipboard.writeText(finalStyleContent);
            setIsStyleCopied(true);
            setTimeout(() => setIsStyleCopied(false), 2000);
        }
    };


    return (
        <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className={`max-w-7xl mx-auto transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <header className="text-center mb-8 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary bg-400% animate-text-shimmer">
                        Suno Prompt Enhancer
                    </h1>
                    <p className="mt-2 text-lg text-content-200">
                        Craft detailed Suno prompts by infusing your lyrics with AI-generated mixing instructions.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="flex flex-col gap-6">
                        {/* INPUTS */}
                        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                             <label htmlFor="lyrics" className="block text-xl font-semibold mb-2">Lyrics with Sections</label>
                             <p className="text-sm text-content-200 mb-3">Paste your lyrics here. Use brackets like [Verse], [Chorus], [Intro] to define sections.</p>
                            <textarea
                                id="lyrics"
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                placeholder={`[Intro]\n...\n[Verse]\nThe rain falls down on the cold, dark street\n...\n[Chorus]\nAnd I'm walking alone again\n...`}
                                className="w-full h-[35rem] p-3 bg-base-300 rounded-md border border-transparent focus:ring-2 focus:ring-brand-primary focus:outline-none resize-y transition-shadow,border-color duration-200"
                            />
                        </div>

                        {/* SETTINGS */}
                         <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Song Characteristics</h2>
                            <p className="text-sm text-content-200 mb-3">Select the characteristics to automatically generate the song style and mixing phrases.</p>
                            <SettingsPanel settings={settings} setSettings={setSettings} />
                        </div>

                        {/* ACTION */}
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !lyrics}
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
                                    disabled={isCopied}
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

                            {finalStyleContent && (
                                <div className="mb-4">
                                     <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-content-200">Final Style Tag Content:</h3>
                                        <div className="flex items-center gap-4">
                                            <CharacterCounter current={finalStyleContent.length} max={STYLE_MAX_LENGTH} />
                                            <button 
                                                onClick={handleCopyStyleToClipboard} 
                                                className={`flex items-center gap-2 text-sm py-1 px-3 rounded-md transition-all duration-200 ${isStyleCopied ? 'bg-green-500/20 text-green-400' : 'bg-base-300 hover:bg-opacity-80'}`} 
                                                title="Copy style content to clipboard"
                                                disabled={isStyleCopied}
                                            >
                                                {isStyleCopied ? (
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
                                    </div>
                                    <p className="p-3 bg-base-300 rounded-md border border-base-300 text-content-100 whitespace-pre-wrap font-mono text-sm max-h-32 overflow-y-auto">{finalStyleContent}</p>
                                </div>
                            )}

                            <textarea
                                readOnly
                                value={outputPrompt}
                                placeholder="Your enhanced prompt will appear here..."
                                className="w-full flex-grow p-3 bg-base-300 rounded-md border border-transparent focus:outline-none resize-none"
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