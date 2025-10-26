import { GoogleGenAI } from "@google/genai";
import { CLICHE_TERMS, LYRIC_EXPANSION_THRESHOLD } from '../constants';
import { AppSettings } from "../types";

// Lazily initialize the AI client.
let ai: GoogleGenAI | null = null;

// FIX: Per coding guidelines, API key must be read from process.env.API_KEY
// and used to initialize GoogleGenAI. This also resolves the TypeScript error
// for `import.meta.env`.
const getAiInstance = (): GoogleGenAI => {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        // This should not be reached if the UI check works, but it's a safeguard.
        throw new Error("Gemini API key is missing. Please set API_KEY in your environment variables.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

export const generateDetailedMusicPrompt = async (
    lyrics: string,
    settings: AppSettings,
): Promise<string> => {
    try {
        const ai = getAiInstance();
        const isInstrumental = lyrics.trim().length === 0;

        const instrumentsText = settings.instrumentation.length > 0 
            ? `It should feature these key instruments: ${settings.instrumentation.join(', ')}.` 
            : '';
        
        const storyText = settings.storyMode 
            ? `The song should be preceded by a short, one-paragraph narrative scene description that sets the stage, inspired by this theme: "${settings.storyPrompt || 'Invent a theme that fits the song.'}". This scene description MUST be wrapped in parentheses, like a script's scene description, e.g., (The scene opens on...).`
            : '';

        let lyricsInstruction: string;
        if (isInstrumental) {
            lyricsInstruction = "The song is instrumental. Do not write any lyrics. Instead, create a structure with sections like [Intro], [Main Theme], [Bridge], [Climax], [Outro] and describe the musical progression in detail for each.";
        } else if (settings.autoExpand && lyrics.trim().length < LYRIC_EXPANSION_THRESHOLD && !lyrics.includes('[Verse]')) {
            lyricsInstruction = `The user has provided a short theme or lyric snippet: "${lyrics}". Expand this into a full song with a complete, coherent lyrical structure (verses, chorus, etc.).`;
        } else {
            lyricsInstruction = `Use the following user-provided lyrics as the lyrical content for the song:\n\n${lyrics}`;
        }

        const prompt = `
You are an expert music producer, songwriter, and audio engineer. Your task is to generate a complete, production-ready prompt for a music AI based on user-provided characteristics and lyrics.

**INPUT CHARACTERISTICS:**
- **Feel:** ${settings.feel}
- **Mood:** ${settings.mood}
- **Speed:** ${settings.speed}
- **Vocals:** ${isInstrumental ? 'No Vocals (Instrumental)' : settings.vocalStyle}
- **Mastering:** ${settings.mastering}
- ${instrumentsText}

**LYRICS INSTRUCTION:**
${lyricsInstruction}

**STORY INSTRUCTION:**
${storyText}

**REQUIRED OUTPUT FORMAT:**
You MUST format the output precisely as follows. Each song section must have a detailed tag, followed by the lyrics for that section (if any), and then separated by a horizontal line '⸻'.

**FORMAT TEMPLATE:**
[Section Name – High-level vibe; key musical elements; performance notes...
{Detailed, technical production notes for this section. Include mixing instructions like EQ, compression, reverb, panning, and specific mastering targets like LUFS or EQ adjustments for this section.}]

⸻

(Lyrics for the section go here)

⸻

[Next Section Name – Vibe; elements...
{Technical details...}]

⸻

(Lyrics for the next section...)

**EXAMPLE OF ONE SECTION:**
[Chorus – wide and soaring; massive open chords, metallic reverb tails, half-time drums with reverse cymbal lifts, vocals layered with scream harmonies under main line
{Chorus guitars open up with octave harmonics, doubled 100 L/R. Bass follows root with 30 Hz sub-synth reinforcement. Vocals: main clean, layer 20% distorted parallel for blade edge. Snare punch +4 kHz, sidechain compressor ducking pads subtly. Master bus glue 1.5:1, +0.5 dB shelf @ 10 kHz for air.}]

⸻

Not for the money, not for the praise,
But for the haze that hides my days.
My reward is the noise when it drowns out the pain,
When the world stops breathing inside my veins.
The real truth, the joy I choose,
Is chasing comfort I can’t refuse.

⸻

**FINAL INSTRUCTIONS:**
- Generate the entire song structure this way.
- The output MUST ONLY be the prompt in the specified format. Do not add any introductory text, explanations, or closing remarks.
- Be extremely creative, detailed, and specific in your musical and technical descriptions.

**CREATIVITY DIRECTIVE:**
To ensure originality, you MUST strictly avoid the concepts, words, and patterns listed in the CLICHE_TERMS list. Strive for unique, specific, and evocative language with lived-in details.
${CLICHE_TERMS}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        const text = response.text;
        if (!text) throw new Error("Received an empty response from the AI.");

        return text.trim();

    } catch (error) {
        console.error("Error generating detailed music prompt:", error);
        throw new Error("Failed to communicate with the Gemini API for prompt generation.");
    }
};


const generateSongStyle = async (feel: string, mood: string, speed: string, vocalStyle: string, instrumentation: string[], mastering: string): Promise<string> => {
    try {
        const ai = getAiInstance();
        const instrumentsText = instrumentation.length > 0 ? `Key Instruments: ${instrumentation.join(', ')}` : 'No specific instruments requested';
        const prompt = `Generate a rich and detailed list of song style phrases based on these characteristics: Feel: ${feel}, Mood: ${mood}, Speed: ${speed}, Vocals: ${vocalStyle}, Mastering: ${mastering}, ${instrumentsText}. The output must be a single, comma-separated string of phrases. Aim for around 15-20 diverse and descriptive phrases covering genre, production, instrumentation, and overall vibe. Examples: 'raw lofi, acoustic ballad, intimate vocals, gentle strumming, tape hiss', 'polished epic, uplifting orchestral score, soaring strings, powerful brass, cinematic percussion'. Do not add any introductory text, explanation, or quotes.

IMPORTANT CREATIVITY DIRECTIVE: To ensure originality, you MUST strictly avoid the concepts, words, and patterns listed below. Strive for unique, specific, and evocative language.
${CLICHE_TERMS}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
        if (!text) return "general pop song"; // Fallback

        return text.trim();

    } catch (error) {
        console.error("Error generating song style:", error);
        throw new Error("Failed to communicate with the Gemini API for style generation.");
    }
};

const expandLyrics = async (style: string, themeLyrics: string): Promise<string> => {
    try {
        const ai = getAiInstance();
        const prompt = `You are an expert songwriter. Your task is to write a complete song based on a style and a theme.
        Style: "${style}"
        Theme/Inspiration (use this as a starting point, if empty, invent a topic that fits the style): "${themeLyrics}"

        Write complete song lyrics that are coherent and well-structured.
        The song MUST have a clear structure using section tags like [Intro], [Verse], [Chorus], [Bridge], [Guitar Solo], and [Outro].
        The output must ONLY be the lyrics and the section tags. Do not include any other text, explanations, or quotation marks.

        IMPORTANT CREATIVITY DIRECTIVE: To ensure originality, you MUST strictly avoid the concepts, words, and patterns listed below. Strive for unique, specific, and evocative language with lived-in details.
        ${CLICHE_TERMS}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const text = response.text;
        if (!text) return "[Verse]\nCould not generate lyrics.";

        return text.trim();
    } catch (error) {
        console.error("Error expanding lyrics:", error);
        throw new Error("Failed to communicate with the Gemini API for lyric expansion.");
    }
};

const generateMixingPhrases = async (feel: string, mood: string, speed: string, vocalStyle: string, instrumentation: string[], mastering: string): Promise<string[]> => {
    try {
        const ai = getAiInstance();
        const instrumentsText = instrumentation.length > 0 ? `Key Instruments: ${instrumentation.join(', ')}` : 'No specific instruments requested';
        const prompt = `Generate a comma-separated list of 50 short, descriptive music production and mixing phrases based on these characteristics: Feel: ${feel}, Mood: ${mood}, Speed: ${speed}, Vocals: ${vocalStyle}, Mastering: ${mastering}, ${instrumentsText}. The phrases should be suitable for a Suno prompt. Examples: 'punchy 808s', 'lush reverb tails', 'crisp hi-hats', 'warm analog bass', 'wide stereo vocals', 'gentle acoustic guitar strumming'. Do not add any introductory text or explanation, just the comma-separated list of phrases.
        
IMPORTANT CREATIVITY DIRECTIVE: To ensure originality, you MUST strictly avoid the concepts, words, and patterns listed below. Strive for unique, specific, and evocative language.
${CLICHE_TERMS}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
        if (!text) return [];

        return text.split(',').map(phrase => phrase.trim()).filter(Boolean);

    } catch (error) {
        console.error("Error generating mixing phrases:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};

export const generateStoryFromLyrics = async (lyrics: string, style: string, storyPrompt: string): Promise<string> => {
    try {
        const ai = getAiInstance();
        const prompt = `You are a creative writer. Your task is to write a short, one-paragraph narrative scene that sets the stage for a song. The scene should be inspired by the song's style, lyrics, and an optional user-provided theme.
        
        Song Style: "${style}"
        Song Lyrics: "${lyrics}"
        Story Theme/Prompt: "${storyPrompt || 'Invent a theme that fits the song.'}"

        Instructions:
        1. Write a single, concise paragraph (2-4 sentences).
        2. The output MUST be wrapped in parentheses, like a script's scene description. e.g., (The scene opens on...).
        3. Do not include any other text, explanations, or quotation marks outside of the parentheses.

IMPORTANT CREATIVITY DIRECTIVE: To ensure originality, you MUST strictly avoid the concepts, words, and patterns listed below. Strive for unique, specific, and evocative language.
${CLICHE_TERMS}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const text = response.text;
        if (!text) return "";

        return text.trim();
    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Failed to communicate with the Gemini API for story generation.");
    }
};

export { generateMixingPhrases, generateSongStyle, expandLyrics };