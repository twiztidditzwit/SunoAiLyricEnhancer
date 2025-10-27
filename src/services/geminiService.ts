import { GoogleGenAI } from "@google/genai";
import { CLICHE_TERMS } from '../constants';

// Lazily initialize the AI client.
let ai: GoogleGenAI | null = null;

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
    styleDescription: string,
): Promise<string> => {
    try {
        const ai = getAiInstance();
        
        const prompt = `
You are an expert music producer, songwriter, and audio engineer. Your task is to generate a complete, production-ready prompt for a music AI based on user-provided lyrics and a style description.

**USER INPUT:**
- **Style Description:** ${styleDescription}
- **Lyrics:** ${lyrics.trim() ? `\n\n${lyrics}` : "(No lyrics provided - create an instrumental piece)"}

**INSTRUCTIONS:**
1.  **Interpret the Style:** Deeply analyze the user's **Style Description** to understand the genre, mood, instrumentation, vocal style, and overall vibe.
2.  **Handle Lyrics:**
    *   If lyrics are provided, use them as the lyrical content for the song. If the lyrics seem short or like a theme, expand them into a full, coherent song structure (verses, chorus, etc.).
    *   If no lyrics are provided, create a detailed instrumental song structure with sections like [Intro], [Main Theme], [Bridge], [Climax], [Outro]. Describe the musical progression for each section instead of providing lyrics.
3.  **Generate Output:** Create the full prompt in the required format below.

**REQUIRED OUTPUT FORMAT:**
You MUST format the output precisely as follows. Each song section must have a detailed tag, followed by the lyrics for that section (if any), and then separated by a horizontal line '⸻'.

**FORMAT TEMPLATE:**
[Section Name – High-level vibe; key musical elements; performance notes...
{Detailed, technical production notes for this section. Include mixing instructions like EQ, compression, reverb, panning, and specific mastering targets like LUFS or EQ adjustments for this section.}]

⸻

(Lyrics for the section go here, or a description of the instrumental music)

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
- The output MUST ONLY be the prompt in the specified format. Do not add any introductory text, explanations, or closing remarks.
- Be extremely creative, detailed, and specific in your musical and technical descriptions, directly inspired by the user's **Style Description**.

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
