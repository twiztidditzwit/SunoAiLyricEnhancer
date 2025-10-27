import React from 'react';
import { AppState } from '../../types';
import { LYRICS_MAX_LENGTH, OTHER_DETAILS_MAX_LENGTH } from '../../constants';
import { CharacterCounter } from '../CharacterCounter';
import { OriginalityFeedback } from '../OriginalityFeedback';

interface Props {
  state: AppState;
  onStateChange: (newState: Partial<AppState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const Step3Details: React.FC<Props> = ({ state, onStateChange, nextStep, prevStep }) => {
  const isNextDisabled = state.lyrics.length > LYRICS_MAX_LENGTH || state.otherDetails.length > OTHER_DETAILS_MAX_LENGTH;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 3: Add Lyrics & Details</h2>
      <p className="text-center text-content-200">
        Write your lyrics or let the AI generate them. Add any final specific details.
      </p>

      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-content-100 mb-1">Lyrics (optional)</label>
        <textarea
          id="lyrics"
          value={state.lyrics}
          onChange={(e) => onStateChange({ lyrics: e.target.value })}
          className="w-full h-64 p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          placeholder="[Verse 1]&#10;The chrome is gleaming...&#10;[Chorus]&#10;Electric dreams in the city of light..."
        />
        <CharacterCounter current={state.lyrics.length} max={LYRICS_MAX_LENGTH} />
        <OriginalityFeedback lyrics={state.lyrics} />
      </div>
      
      <div>
        <label htmlFor="other-details" className="block text-sm font-medium text-content-100 mb-1">Other Details (optional)</label>
        <textarea
          id="other-details"
          value={state.otherDetails}
          onChange={(e) => onStateChange({ otherDetails: e.target.value })}
          className="w-full h-24 p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          placeholder="e.g., Male vocalist with a smooth, baritone voice. Tempo should be around 120 BPM. Include a retro synth arpeggio."
        />
        <CharacterCounter current={state.otherDetails.length} max={OTHER_DETAILS_MAX_LENGTH} />
      </div>

      <div className="flex justify-between">
        <button onClick={prevStep} className="py-2 px-6 bg-base-300 text-content-100 font-semibold rounded-lg hover:bg-base-300/70">
          Back
        </button>
        <button onClick={nextStep} disabled={isNextDisabled} className="py-2 px-6 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed transition-all">
          Generate
        </button>
      </div>
    </div>
  );
};
