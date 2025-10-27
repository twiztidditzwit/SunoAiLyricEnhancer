export type SectionType = 'Intro' | 'Verse' | 'Chorus' | 'Pre-Chorus' | 'Bridge' | 'Solo' | 'Outro';

export interface SongSection {
  id: string; 
  type: SectionType;
  name: string; 
}

export interface SectionDetails {
  lyrics: string;
  instruments: {
    [instrument: string]: string;
  };
}

export interface AppState {
  // Step 1
  genre: string;
  mood: string;
  theme: string;

  // Step 2
  instruments: string[];
  songStructure: SongSection[];

  // Step 3
  sectionDetails: {
    [sectionId: string]: SectionDetails;
  };
}
