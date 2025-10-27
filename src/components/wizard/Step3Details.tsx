import React from 'react';
import { AppState, SectionDetails } from '../../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const Step3Details: React.FC<Props> = ({ state, updateState, nextStep, prevStep }) => {
  
  const handleDetailChange = (sectionId: string, field: 'lyrics' | string, value: string) => {
    const existingDetails = state.sectionDetails[sectionId] || { lyrics: '', instruments: {} };
    let newDetails: SectionDetails;

    if (field === 'lyrics') {
      newDetails = { ...existingDetails, lyrics: value };
    } else {
      newDetails = {
        ...existingDetails,
        instruments: {
          ...existingDetails.instruments,
          [field]: value,
        },
      };
    }

    updateState({
      sectionDetails: {
        ...state.sectionDetails,
        [sectionId]: newDetails,
      },
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center">Step 3: Detail Each Section</h2>
      
      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
        {state.songStructure.map(section => (
          <div key={section.id} className="bg-base-300/50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-brand-secondary">{section.name}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor={`lyrics-${section.id}`} className="block text-sm font-medium text-content-200">Lyrics</label>
                <textarea
                  id={`lyrics-${section.id}`}
                  value={state.sectionDetails[section.id]?.lyrics || ''}
                  onChange={(e) => handleDetailChange(section.id, 'lyrics', e.target.value)}
                  placeholder={`Lyrics for ${section.name}...`}
                  className="mt-1 block w-full bg-base-100 rounded-md border-transparent h-24 focus:border-brand-primary focus:ring-brand-primary/50"
                />
              </div>

              {state.instruments.length > 0 && <h4 className="font-semibold text-content-200 pt-2">Instrument Notes</h4>}
              {state.instruments.map(instrument => (
                <div key={instrument}>
                  <label htmlFor={`${instrument}-${section.id}`} className="block text-sm font-medium text-content-200">{instrument}</label>
                  <input
                    type="text"
                    id={`${instrument}-${section.id}`}
                    value={state.sectionDetails[section.id]?.instruments[instrument] || ''}
                    onChange={(e) => handleDetailChange(section.id, instrument, e.target.value)}
                    placeholder={`e.g., Driving 8th-note rhythm, palm-muted power chords...`}
                    className="mt-1 block w-full bg-base-100 rounded-md border-transparent focus:border-brand-primary focus:ring-brand-primary/50"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={prevStep} className="py-2 px-6 bg-base-300 text-content-100 font-semibold rounded-lg hover:bg-base-300/70">
          Back
        </button>
        <button onClick={nextStep} className="py-2 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300">
          Next: Generate
        </button>
      </div>
    </div>
  );
};
