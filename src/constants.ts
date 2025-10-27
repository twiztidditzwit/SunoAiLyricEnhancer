import { AppState } from "./types";

export const CORE_IDEA_MAX_LENGTH = 500;
export const LYRICS_MAX_LENGTH = 4000;
export const OTHER_DETAILS_MAX_LENGTH = 500;

export const GENRES = [
  "Pop", "Rock", "Hip-Hop", "Electronic", "R&B", "Jazz", "Classical", "Folk", "Country", "Metal", "Blues", "Reggae", "Indie", "Alternative"
];

export const MOODS = [
  "Happy", "Sad", "Energetic", "Relaxing", "Romantic", "Epic", "Melancholic", "Uplifting", "Mysterious", "Aggressive", "Nostalgic"
];

export const STRUCTURE_PARTS = [
  "Intro", "Verse", "Pre-Chorus", "Chorus", "Post-Chorus", "Bridge", "Guitar Solo", "Instrumental Break", "Outro", "Fade Out"
];

export const INITIAL_STATE: AppState = {
  coreIdea: '',
  genre: GENRES[0],
  mood: MOODS[0],
  instrumentation: '',
  structure: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
  lyrics: '',
  otherDetails: '',
};
