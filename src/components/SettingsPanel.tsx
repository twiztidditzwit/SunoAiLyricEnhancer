import React from 'react';
import { AppSettings } from '../types';
import { FEEL_OPTIONS, MOOD_OPTIONS, SPEED_OPTIONS, VOCAL_STYLE_OPTIONS, INSTRUMENT_OPTIONS, MASTERING_STYLE_OPTIONS } from '../constants';

interface SettingsPanelProps {
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings }) => {
    const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleInstrumentChange = (instrument: string) => {
        const newInstrumentation = settings.instrumentation.includes(instrument)
            ? settings.instrumentation.filter(i => i !== instrument)
            : [...settings.instrumentation, instrument];
        handleSettingChange('instrumentation', newInstrumentation);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="feel" className="block text-sm font-medium text-content-200 mb-1">Feel</label>
                    <select
                        id="feel"
                        value={settings.feel}
                        onChange={(e) => handleSettingChange('feel', e.target.value)}
                        className="w-full p-2 bg-base-300 rounded-md border border-transparent focus:ring-1 focus:ring-brand-primary focus:outline-none transition-all duration-200"
                    >
                        {FEEL_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-content-200 mb-1">Mood</label>
                    <select
                        id="mood"
                        value={settings.mood}
                        onChange={(e) => handleSettingChange('mood', e.target.value)}
                        className="w-full p-2 bg-base-300 rounded-md border border-transparent focus:ring-1 focus:ring-brand-primary focus:outline-none transition-all duration-200"
                    >
                        {MOOD_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="speed" className="block text-sm font-medium text-content-200 mb-1">Speed</label>
                    <select
                        id="speed"
                        value={settings.speed}
                        onChange={(e) => handleSettingChange('speed', e.target.value)}
                        className="w-full p-2 bg-base-300 rounded-md border border-transparent focus:ring-1 focus:ring-brand-primary focus:outline-none transition-all duration-200"
                    >
                        {SPEED_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="vocalStyle" className="block text-sm font-medium text-content-200 mb-1">Vocal Style</label>
                    <select
                        id="vocalStyle"
                        value={settings.vocalStyle}
                        onChange={(e) => handleSettingChange('vocalStyle', e.target.value)}
                        className="w-full p-2 bg-base-300 rounded-md border border-transparent focus:ring-1 focus:ring-brand-primary focus:outline-none transition-all duration-200"
                    >
                        {VOCAL_STYLE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="mastering" className="block text-sm font-medium text-content-200 mb-1">Mastering Style</label>
                    <select
                        id="mastering"
                        value={settings.mastering}
                        onChange={(e) => handleSettingChange('mastering', e.target.value)}
                        className="w-full p-2 bg-base-300 rounded-md border border-transparent focus:ring-1 focus:ring-brand-primary focus:outline-none transition-all duration-200"
                    >
                        {MASTERING_STYLE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-content-200 mb-2">Key Instruments (optional)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2 p-3 bg-base-300 rounded-md">
                    {INSTRUMENT_OPTIONS.map(instrument => (
                        <label key={instrument} className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors duration-200">
                            <input
                                type="checkbox"
                                checked={settings.instrumentation.includes(instrument)}
                                onChange={() => handleInstrumentChange(instrument)}
                                className="h-4 w-4 rounded bg-base-100 border-content-200 text-brand-primary focus:ring-brand-primary focus:ring-offset-base-300"
                            />
                            <span className="text-sm text-content-100">{instrument}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div className="mt-2 border-t border-base-300 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.autoExpand}
                        onChange={(e) => handleSettingChange('autoExpand', e.target.checked)}
                        className="h-5 w-5 rounded bg-base-100 border-content-200 text-brand-primary focus:ring-brand-primary focus:ring-offset-base-300"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-content-100">Flesh out full song</span>
                        <span className="text-xs text-content-200">Auto-generate lyrics if the input is short or unstructured to fill the prompt.</span>
                    </div>
                </label>
            </div>
            <div className="mt-2 border-t border-base-300 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.storyMode}
                        onChange={(e) => handleSettingChange('storyMode', e.target.checked)}
                        className="h-5 w-5 rounded bg-base-100 border-content-200 text-brand-primary focus:ring-brand-primary focus:ring-offset-base-300"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-content-100">Make it a story</span>
                        <span className="text-xs text-content-200">Generate a narrative intro to provide context for the song.</span>
                    </div>
                </label>
                 {settings.storyMode && (
                    <div className="mt-3">
                        <label htmlFor="storyPrompt" className="block text-sm font-medium text-content-200 mb-1">Story Theme (optional)</label>
                        <textarea
                            id="storyPrompt"
                            value={settings.storyPrompt}
                            onChange={(e) => handleSettingChange('storyPrompt', e.target.value)}
                            placeholder="e.g., A detective investigating a case in a rainy cyberpunk city."
                            className="w-full h-20 p-2 bg-base-300 rounded-md border border-transparent focus:ring-1 focus:ring-brand-primary focus:outline-none transition-shadow duration-200 resize-y"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export { SettingsPanel };