export interface AppState {
  coreIdea: string;
  genre: string;
  mood: string;
  instrumentation: string;
  structure: string[]; // e.g., ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro']
  lyrics: string;
  otherDetails: string;
}

export interface OriginalityScore {
  score: number;
  explanation: string;
}
