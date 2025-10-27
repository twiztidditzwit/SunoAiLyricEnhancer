import { AppState } from "./types";

export const CORE_IDEA_MAX_LENGTH = 500;
export const LYRICS_MAX_LENGTH = 4000;
export const OTHER_DETAILS_MAX_LENGTH = 500;

export const GENRES = [
  "Pop", "Rock", "Hip-Hop", "Electronic", "R&B", "Jazz", "Classical", "Folk", "Country", "Metal", "Blues", "Reggae", "Indie", "Alternative"
];

export const MOODS = [
  "Happy", "Sad", "Energetic", "Relaxing", "Romantic", "Epic", "Melancholic", "Uplifting", "Mysterious", "Aggressive", "Nostalgic", "Dreamy", "Tense", "Peaceful", "Passionate", "Cinematic", "Hypnotic", "Dark", "Whimsical", "Anxious", "Hopeful", "Playful", "Introspective", "Haunting", "Serene", "Funky", "Gritty", "Lush", "Minimalist", "Chaotic", "Euphoric", "Brooding"
];

export const STRUCTURE_PARTS = [
  "Intro", "Verse", "Pre-Chorus", "Chorus", "Post-Chorus", "Bridge", "Guitar Solo", "Instrumental Break", "Outro", "Fade Out"
];

export const generateId = () => `_${Math.random().toString(36).substring(2, 11)}`;

const initialStructure = [
  { id: generateId(), name: 'Verse' },
  { id: generateId(), name: 'Chorus' },
  { id: generateId(), name: 'Verse' },
  { id: generateId(), name: 'Chorus' },
  { id: generateId(), name: 'Bridge' },
  { id: generateId(), name: 'Chorus' },
  { id: generateId(), name: 'Outro' },
];


export const INITIAL_STATE: AppState = {
  coreIdea: '',
  genre: [GENRES[0]],
  mood: [MOODS[0]],
  instrumentation: '',
  structure: initialStructure,
  lyrics: '',
  otherDetails: '',
};