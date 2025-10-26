import { GoogleGenAI } from "@google/genai";
import { CLICHE_TERMS } from '../constants';

// The API key is now checked in the App.tsx component to provide a user-friendly
// error message on deployment platforms like Vercel if the key is missing.
// The '!' non-null assertion is safe because the UI won't render or call this
// service if the API_KEY is not present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateSongStyle = async (feel: string, mood: string, speed: string, vocalStyle: string, instrumentation: string[], mastering: string): Promise<string> => {
    try {
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