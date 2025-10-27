import { AppState, SectionType } from "./types";

export const INITIAL_STATE: AppState = {
    genre: '',
    mood: '',
    theme: '',
    instruments: [],
    songStructure: [
        { id: crypto.randomUUID(), type: 'Verse', name: 'Verse 1' },
        { id: crypto.randomUUID(), type: 'Chorus', name: 'Chorus' },
        { id: crypto.randomUUID(), type: 'Verse', name: 'Verse 2' },
        { id: crypto.randomUUID(), type: 'Chorus', name: 'Chorus' },
        { id: crypto.randomUUID(), type: 'Bridge', name: 'Bridge' },
        { id: crypto.randomUUID(), type: 'Chorus', name: 'Chorus' },
        { id: crypto.randomUUID(), type: 'Outro', name: 'Outro' },
    ],
    sectionDetails: {},
};

export const SECTION_TYPES: SectionType[] = [
    'Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Solo', 'Outro'
];

export const INSTRUMENT_PALETTE: string[] = [
    'Drums', 'Bass', 'Acoustic Guitar', 'Electric Guitar', 'Piano', 'Keys', 
    'Synths', 'Strings', 'Brass', 'Woodwinds', 'Lead Vocals', 'Backing Vocals', 'FX'
];

export const MAX_LYRICS_LENGTH = 1000;
export const MAX_STYLE_LENGTH = 500;
export const MAX_STORY_LENGTH = 1500;
