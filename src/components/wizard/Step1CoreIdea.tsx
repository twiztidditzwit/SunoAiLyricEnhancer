import React from 'react';
import { AppState } from '../../types';
import { CORE_IDEA_MAX_LENGTH } from '../../constants';
import { CharacterCounter } from '../CharacterCounter';

interface Props {
  state: AppState;
  onStateChange: (newState: Partial<AppState>) => void;
  nextStep: () => void;
}

export const Step1CoreIdea: React.FC<Props> = ({ state, onStateChange, nextStep }) => {
  const isNextDisabled = state.coreIdea.trim().length === 0 || state.coreIdea.length > CORE_IDEA_MAX_LENGTH;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStateChange({ coreIdea: e.target.value });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 1: What's Your Song About?</h2>
      <p className="text-center text-content-200">Describe the core idea, theme, or story of your song. This will be the foundation for everything else.</p>
      
      <div>
        <textarea
          value={state.coreIdea}
          onChange={handleChange}
          className="w-full h-40 p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          placeholder="e.g., A song about a robot who discovers music for the first time and dreams of becoming a DJ."
        />
        <CharacterCounter current={state.coreIdea.length} max={CORE_IDEA_MAX_LENGTH} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={isNextDisabled}
          className="py-2 px-6 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};
