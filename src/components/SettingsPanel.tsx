// Fix: Implemented the SettingsPanel component.
import React from 'react';
import { Settings, Mood, RhymeScheme, Originality } from '../types';

interface SettingsPanelProps {
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
    
    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-content-100 mb-6">Creative Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mood Setting */}
                <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-content-200 mb-2">Mood</label>
                    <select
                        id="mood"
                        name="mood"
                        value={settings.mood}
                        onChange={(e) => handleSettingChange('mood', e.target.value as Mood)}
                        className="w-full bg-base-300 border border-base-300 text-content-100 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="upbeat">Upbeat</option>
                        <option value="mellow">Mellow</option>
                        <option value="introspective">Introspective</option>
                        <option value="intense">Intense</option>
                        <option value="experimental">Experimental</option>
                    </select>
                </div>

                {/* Rhyme Scheme Setting */}
                <div>
                    <label htmlFor="rhymeScheme" className="block text-sm font-medium text-content-200 mb-2">Rhyme Scheme</label>
                    <select
                        id="rhymeScheme"
                        name="rhymeScheme"
                        value={settings.rhymeScheme}
                        onChange={(e) => handleSettingChange('rhymeScheme', e.target.value as RhymeScheme)}
                        className="w-full bg-base-300 border border-base-300 text-content-100 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="AABB">AABB</option>
                        <option value="ABAB">ABAB</option>
                        <option value="ABCB">ABCB</option>
                        <option value="none">None</option>
                    </select>
                </div>

                {/* Originality Setting */}
                <div>
                    <label htmlFor="originality" className="block text-sm font-medium text-content-200 mb-2">Originality</label>
                    <select
                        id="originality"
                        name="originality"
                        value={settings.originality}
                        onChange={(e) => handleSettingChange('originality', e.target.value as Originality)}
                        className="w-full bg-base-300 border border-base-300 text-content-100 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="conventional">Conventional</option>
                        <option value="somewhat-original">Somewhat Original</option>
                        <option value="highly-original">Highly Original</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export { SettingsPanel };
