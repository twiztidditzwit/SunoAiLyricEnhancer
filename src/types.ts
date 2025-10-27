export interface SongSection {
  id: string;
  name: string;
}

export interface AppState {
  coreIdea: string;
  genre: string[];
  mood: string[];
  instrumentation: string;
  structure: SongSection[];
  lyrics: string;
  otherDetails: string;
}

export interface OriginalityScore {
  score: number;
  explanation: string;
}