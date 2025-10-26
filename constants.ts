export const SUNO_PROMPT_MAX_LENGTH = 5000;
export const STYLE_MAX_LENGTH = 1000;
export const LYRIC_EXPANSION_THRESHOLD = 150;

export const FEEL_OPTIONS = [
    'Acoustic',
    'Atmospheric',
    'Cinematic',
    'Dreamy',
    'Electronic',
    'Gritty',
    'Intimate',
    'Lo-fi',
    'Minimalist',
    'Organic',
    'Polished',
    'Raw',
    'Smooth',
    'Synthetic',
    'Vintage',
    'Warm'
];

export const MOOD_OPTIONS = [
    'Aggressive',
    'Anxious',
    'Calm',
    'Dark',
    'Driving',
    'Energetic',
    'Epic',
    'Ethereal',
    'Happy',
    'Haunting',
    'Hopeful',
    'Hypnotic',
    'Melancholic',
    'Mysterious',
    'Nostalgic',
    'Playful',
    'Reflective',
    'Romantic',
    'Sad',
    'Serene',
    'Somber',
    'Triumphant',
    'Uplifting'
];

export const SPEED_OPTIONS = [
    'Very Slow',
    'Slow',
    'Mid-tempo',
    'Fast',
    'Very Fast'
];

export const VOCAL_STYLE_OPTIONS = [
    'No Vocals (Instrumental)',
    'Male Lead',
    'Female Lead',
    'Androgynous Lead',
    'Male Harmony',
    'Female Harmony',
    'Group Vocals / Choir',
    'Whispery Vocals',
    'Powerful Belt',
    'Raspy Vocals',
    'Smooth Croon',
    'Ethereal Vocals',
    'Aggressive Shouts',
    'Spoken Word',
];

export const INSTRUMENT_OPTIONS = [
    'Acoustic Guitar',
    'Electric Guitar',
    'Distorted Electric Guitar',
    'Bass Guitar',
    'Acoustic Drums',
    'Drum Machine (808/909)',
    'Piano',
    'Electric Piano (Rhodes)',
    'Synthesizer',
    'Synth Bass',
    'Strings (Orchestral)',
    'Brass Section',
    'Woodwinds',
    'Organ',
    'Banjo',
    'Ukulele',
    'Mandolin',
    'Harp',
    'Vibraphone',
    'Soundscapes / Pads'
];

export const MASTERING_STYLE_OPTIONS = [
    'Standard Commercial Loudness',
    'Highly Compressed & Loud (Radio Ready)',
    'Dynamic & Open (Audiophile)',
    'Vintage Warmth (Analog Tape)',
    'Lo-fi & Saturated',
    'Wide & Immersive (Cinematic)',
    'Narrow & Focused (Mono Compatible)',
    'Crisp & Bright',
    'Warm & Bass-heavy',
];

export const CLICHE_TERMS = `
---
LIST OF CLICHES, TROPES, AND PHRASES TO AVOID:

**Overused Words & Imagery:**
Neon, neon lights, neon cities, Echoes (of joy, of silence), Symphony, Shadows (of footsteps, of love), Intertwined, intertwine, entwined, Melody, Spectral, Whispers, whispered dreams, Crimson, "With every..." (step, bite, move, breath, touch), Come what may, Hand in hand, Electric glow, digital glow, Grace, Embrace, Soar, Rise above, Pulse, Dreams, chasing dreams, Love, Heart, Baby, Night, Life, Time, World, Sky, Eyes, Tears, Soul, Stars, Fire, Rain, Light, Heaven, Together, Forever, Pain, Girl, Kiss, Dance, Mind, Mystery, collide, unfold, Tangled sheets.

**Overused Rhymes (AI Nursery Rhymes):**
Fire / Desire, Love / Above, Heart / Start, Night / Light, Girl / World, Cry / Die, Pain / Rain, Dream / Seem, Eyes / Skies, You / True, Baby / Crazy, Life / Wife, Mind / Find, Kiss / Bliss, Dance / Romance, Feel / Real, Fly / High, Tear / Fear, Star / Far, Blue / You.

**Overused Tropes & Themes:**
Unrequited love, Heartbreak / "broken heart", Partying/clubbing/nightlife romance, Idealized romance ("soulmates," "forever love"), Generic struggles & perseverance, Triumph over adversity, Coming of age / personal growth, Escaping reality / "run away" motifs, Idealized beauty / flawless partner, The rebellious outsider, Nostalgia for the past ("good old days"), The underdog story, Living life to the fullest ("YOLO" vibes), The journey (literal or metaphorical), Longing for freedom / escape, Overcoming generic obstacles, Celebrating individuality, The end of a relationship / moving on, Personal redemption / "finding myself", Yearning for a better future.

**Common Phrases to Replace:**
"I can't live without you", "You are my everything", "Together forever", "You make me whole", "My one and only", "You complete me", "Lost without you", "Heart of gold", "Love at first sight", "You're my reason why", "Chasing dreams", "Feel the beat", "In my mind", "Time will tell", "Waiting for you", "Burning desire", "Under the stars", "Broken heart", "Never let you go", "Hold me tight", "Digital glow".

**Avoid These AI Authorship Patterns:**
1.  **Repetition-heavy rhymes:** Avoid simple loops like "town/down, all/fall".
2.  **Universal but empty emotions:** Avoid heartbreak, longing, nostalgia without specific, personal detail.
3.  **Overuse of cosmic/elemental imagery:** Avoid relying on stars, fire, sky, rain, light, heaven.
4.  **Predictable chorus lines:** Do not resolve with cliché hooks like "forever" or "together".
5.  **Generic motivational arcs:** Avoid generic themes of triumph, rising above, dreams, perseverance.
6.  **No grounding in specific detail:** Lyrics must feel real, not lacking cultural markers, slang, or lived-in nuance.
---
`;

// --- Originality Advisor Constants ---
export const COSMIC_IMAGERY_KEYWORDS = [
    'star', 'stars', 'starlight', 'stardust',
    'fire', 'flame', 'ember', 'fiery',
    'rain', 'storm', 'thunder', 'lightning',
    'sky', 'skies',
    'light', 'glow',
    'heaven', 'angel', 'divine',
    'cosmic', 'celestial', 'galaxy', 'universe', 'nebula',
    'lunar', 'solar', 'sun', 'moon',
    'elemental', 'ocean', 'river', 'wind'
];

export const IMAGERY_THRESHOLD = 4;

export const IMAGERY_FEEDBACK_MESSAGE = `AI Originality Tip: We noticed the generated text uses cosmic or elemental words like 'stars', 'fire', or 'rain' more than ${IMAGERY_THRESHOLD} times. This can sometimes sound generic. Consider replacing them with more specific, personal details to make your song more unique.`;