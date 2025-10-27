import React, { useRef } from 'react';
import { AppState } from '../../types';
import { GENRES, MOODS, STRUCTURE_PARTS, generateId } from '../../constants';
import { DragHandleIcon } from '../icons/DragHandleIcon';

interface Props {
  state: AppState;
  onStateChange: (newState: Partial<AppState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const Step2Structure: React.FC<Props> = ({ state, onStateChange, nextStep, prevStep }) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
        dragItem.current = null;
        dragOverItem.current = null;
        return;
    }
    const newStructure = [...state.structure];
    const draggedItemContent = newStructure.splice(dragItem.current, 1)[0];
    newStructure.splice(dragOverItem.current, 0, draggedItemContent);
    onStateChange({ structure: newStructure });
    dragItem.current = null;
    dragOverItem.current = null;
  };
  
  const handleStructureChange = (id: string, newName: string) => {
    const newStructure = state.structure.map(part => 
      part.id === id ? { ...part, name: newName } : part
    );
    onStateChange({ structure: newStructure });
  };

  const addStructurePart = () => {
    const newPart = { id: generateId(), name: 'Verse' };
    onStateChange({ structure: [...state.structure, newPart] });
  };
  
  const removeStructurePart = (id: string) => {
    const newStructure = state.structure.filter(part => part.id !== id);
    onStateChange({ structure: newStructure });
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = state.genre.includes(genre)
      ? state.genre.filter(g => g !== genre)
      : [...state.genre, genre];

    // Ensure at least one genre is always selected
    if (newGenres.length >= 1) {
      onStateChange({ genre: newGenres });
    }
  };

  const handleMoodToggle = (mood: string) => {
    const newMoods = state.mood.includes(mood)
      ? state.mood.filter(m => m !== mood)
      : [...state.mood, mood];
    
    // Ensure at least one mood is always selected
    if (newMoods.length >= 1) {
      onStateChange({ mood: newMoods });
    }
  };


  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 2: Define the Vibe & Structure</h2>
      <p className="text-center text-content-200">Let's set the musical foundation. Choose the genre, mood, and song structure.</p>
      
      <div>
        <label className="block text-sm font-medium text-content-100 mb-2">
            Genre (select one or more to blend)
        </label>
        <div className="flex flex-wrap gap-2">
            {GENRES.map(g => {
                const isSelected = state.genre.includes(g);
                return (
                    <button
                        key={g}
                        onClick={() => handleGenreToggle(g)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
                            isSelected 
                                ? 'bg-brand-primary border-brand-primary text-white' 
                                : 'bg-base-100 border-base-300 text-content-100 hover:bg-base-300/50 hover:border-base-300'
                        }`}
                    >
                        {g}
                    </button>
                )
            })}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-content-100 mb-2">
            Mood (select one or more)
        </label>
        <div className="flex flex-wrap gap-2">
            {MOODS.map(m => {
                const isSelected = state.mood.includes(m);
                return (
                    <button
                        key={m}
                        onClick={() => handleMoodToggle(m)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${
                            isSelected 
                                ? 'bg-brand-secondary border-brand-secondary text-white' 
                                : 'bg-base-100 border-base-300 text-content-100 hover:bg-base-300/50 hover:border-base-300'
                        }`}
                    >
                        {m}
                    </button>
                )
            })}
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
        <div className="space-y-2" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          {state.structure.map((part, index) => (
            <div 
              key={part.id} 
              className="flex items-center gap-2 bg-base-100 p-2 rounded-lg"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
            >
              <div className="cursor-grab text-content-200">
                <DragHandleIcon />
              </div>
              <select
                value={part.name}
                onChange={(e) => handleStructureChange(part.id, e.target.value)}
                className="w-full p-2 bg-base-200 border border-base-300 rounded-lg"
              >
                {STRUCTURE_PARTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button
                onClick={() => removeStructurePart(part.id)}
                className="p-2 text-red-400 hover:text-red-300 flex-shrink-0"
                aria-label={`Remove ${part.name}`}
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