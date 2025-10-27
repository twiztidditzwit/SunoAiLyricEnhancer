import React from 'react';
import { AppState } from '../../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  nextStep: () => void;
}

export const Step1CoreIdea: React.FC<Props> = ({ state, updateState, nextStep }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 1: The Core Idea</h2>
      <p className="text-center text-content-200">Let's start with the basics. What's the overall vibe of your song?</p>
      
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-content-200">Genre</label>
        <input
          type="text"
          id="genre"
          value={state.genre}
          onChange={(e) => updateState({ genre: e.target.value })}
          placeholder="e.g., Psychedelic Rock, Synthpop, Lo-fi Hip Hop"
          className="mt-1 block w-full bg-base-300 rounded-md border-transparent focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition duration-300"
        />
      </div>
      
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-content-200">Mood</label>
        <input
          type="text"
          id="mood"
          value={state.mood}
          onChange={(e) => updateState({ mood: e.target.value })}
          placeholder="e.g., Nostalgic, Energetic, Melancholic, Hopeful"
          className="mt-1 block w-full bg-base-300 rounded-md border-transparent focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition duration-300"
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-content-200">Theme / Story</label>
        <textarea
          id="theme"
          value={state.theme}
          onChange={(e) => updateState({ theme: e.target.value })}
          placeholder="e.g., A long road trip through the desert at night, rediscovering a lost friendship, the feeling of the first day of summer."
          className="mt-1 block w-full bg-base-300 rounded-md border-transparent focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition duration-300 h-24"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="py-2 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300"
        >
          Next: Structure
        </button>
      </div>
    </div>
  );
};
