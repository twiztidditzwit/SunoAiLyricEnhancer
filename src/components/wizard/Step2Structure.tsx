import React from 'react';
import { AppState } from '../../types';
import { GENRES, MOODS, STRUCTURE_PARTS } from '../../constants';

interface Props {
  state: AppState;
  onStateChange: (newState: Partial<AppState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const Step2Structure: React.FC<Props> = ({ state, onStateChange, nextStep, prevStep }) => {

  const handleStructureChange = (index: number, value: string) => {
    const newStructure = [...state.structure];
    newStructure[index] = value;
    onStateChange({ structure: newStructure });
  };

  const addStructurePart = () => {
    onStateChange({ structure: [...state.structure, 'Verse'] });
  };
  
  const removeStructurePart = (index: number) => {
    const newStructure = state.structure.filter((_, i) => i !== index);
    onStateChange({ structure: newStructure });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 2: Define the Vibe & Structure</h2>
      <p className="text-center text-content-200">Let's set the musical foundation. Choose the genre, mood, and song structure.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-content-100 mb-1">Genre</label>
          <select
            id="genre"
            value={state.genre}
            onChange={(e) => onStateChange({ genre: e.target.value })}
            className="w-full p-2 bg-base-200 border border-base-300 rounded-lg"
          >
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-content-100 mb-1">Mood</label>
          <select
            id="mood"
            value={state.mood}
            onChange={(e) => onStateChange({ mood: e.target.value })}
            className="w-full p-2 bg-base-200 border border-base-300 rounded-lg"
          >
            {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="instrumentation" className="block text-sm font-medium text-content-100 mb-1">Instrumentation</label>
        <input
          type="text"
          id="instrumentation"
          value={state.instrumentation}
          onChange={(e) => onStateChange({ instrumentation: e.target.value })}
          className="w-full p-2 bg-base-200 border border-base-300 rounded-lg"
          placeholder="e.g., Acoustic guitar, synth pads, 808 drums"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-content-100 mb-2">Song Structure</label>
        <div className="space-y-2">
          {state.structure.map((part, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={part}
                onChange={(e) => handleStructureChange(index, e.target.value)}
                className="w-full p-2 bg-base-200 border border-base-300 rounded-lg"
              >
                {STRUCTURE_PARTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button
                onClick={() => removeStructurePart(index)}
                className="p-2 text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addStructurePart}
          className="mt-2 text-sm text-brand-primary hover:text-brand-secondary"
        >
          + Add Part
        </button>
      </div>

      <div className="flex justify-between">
        <button onClick={prevStep} className="py-2 px-6 bg-base-300 text-content-100 font-semibold rounded-lg hover:bg-base-300/70">
          Back
        </button>
        <button onClick={nextStep} className="py-2 px-6 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary">
          Next
        </button>
      </div>
    </div>
  );
};
