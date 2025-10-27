import React, { useState } from 'react';
import { AppState, SongSection, SectionType } from '../../types';
import { INSTRUMENT_PALETTE, SECTION_TYPES } from '../../constants';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const Step2Structure: React.FC<Props> = ({ state, updateState, nextStep, prevStep }) => {
  const [newSectionType, setNewSectionType] = useState<SectionType>('Verse');

  const addSection = () => {
    const newSection: SongSection = {
      id: crypto.randomUUID(),
      type: newSectionType,
      name: `${newSectionType} ${state.songStructure.filter(s => s.type === newSectionType).length + 1}`,
    };
    const newStructure = [...state.songStructure, newSection];
    updateState({ songStructure: newStructure });
  };

  const removeSection = (id: string) => {
    const newStructure = state.songStructure.filter(s => s.id !== id);
    updateState({ songStructure: newStructure });
  };
  
  const updateSectionName = (id: string, newName: string) => {
    const newStructure = state.songStructure.map(s => s.id === id ? { ...s, name: newName } : s);
    updateState({ songStructure: newStructure });
  }

  const toggleInstrument = (instrument: string) => {
    const newInstruments = state.instruments.includes(instrument)
      ? state.instruments.filter(i => i !== instrument)
      : [...state.instruments, instrument];
    updateState({ instruments: newInstruments });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 2: Structure & Instruments</h2>
      
      {/* Song Structure Builder */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Build Your Song Structure</h3>
        <div className="space-y-3 mb-4">
          {state.songStructure.map((section) => (
            <div key={section.id} className="flex items-center gap-2 bg-base-300 p-2 rounded-md">
               <span className="font-bold text-content-200">{section.type}</span>
               <input 
                  type="text" 
                  value={section.name}
                  onChange={(e) => updateSectionName(section.id, e.target.value)}
                  className="flex-grow bg-base-100 rounded-md p-1 border-transparent focus:border-brand-primary focus:ring-brand-primary/50"
               />
              <button onClick={() => removeSection(section.id)} className="text-red-400 hover:text-red-300 font-bold p-1">✕</button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={newSectionType} onChange={(e) => setNewSectionType(e.target.value as SectionType)} className="bg-base-300 rounded-md p-2 border-transparent focus:border-brand-primary focus:ring-brand-primary/50">
            {SECTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <button onClick={addSection} className="py-2 px-4 bg-brand-primary/80 text-white font-semibold rounded-lg hover:bg-brand-primary">
            + Add Section
          </button>
        </div>
      </div>

      {/* Instrument Palette */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Choose Your Instrument Palette</h3>
        <div className="flex flex-wrap gap-3">
          {INSTRUMENT_PALETTE.map(instrument => (
            <button
              key={instrument}
              onClick={() => toggleInstrument(instrument)}
              className={`py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${state.instruments.includes(instrument) ? 'bg-brand-secondary text-white' : 'bg-base-300 text-content-100 hover:bg-base-300/70'}`}
            >
              {instrument}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={prevStep} className="py-2 px-6 bg-base-300 text-content-100 font-semibold rounded-lg hover:bg-base-300/70">
          Back
        </button>
        <button onClick={nextStep} className="py-2 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300">
          Next: Details
        </button>
      </div>
    </div>
  );
};
