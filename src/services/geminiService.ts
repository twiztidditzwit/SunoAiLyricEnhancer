import { GoogleGenAI } from "@google/genai";
import { AppState, SongSection } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (state: AppState): string => {
    let prompt = `You are an expert music producer and audio engineer creating a detailed prompt for a music AI like Suno.
Your task is to take a structured song concept and format it into a complete, professional, copy-paste ready prompt.

The final output MUST follow this format for each section:
[Section Name – musical vibe; key instruments
{Detailed mixing and production notes, including specific frequencies, compression, reverb, effects, and mastering targets like LUFS.}]
Lyrics for the section...
⸻

Here is the structured song concept provided by the user:

## Overall Vibe
- Genre: ${state.genre || 'Not specified'}
- Mood: ${state.mood || 'Not specified'}
- Theme: ${state.theme || 'Not specified'}

## Selected Instruments
${state.instruments.length > 0 ? state.instruments.join(', ') : 'Not specified'}

## Song Structure and Details
`;

    state.songStructure.forEach((section: SongSection) => {
        const details = state.sectionDetails[section.id] || { lyrics: '', instruments: {} };
        prompt += `
---
### Section: ${section.name} (${section.type})

**Lyrics:**
${details.lyrics || '(No lyrics provided for this section)'}

**Instrument Notes:**
`;
        if (state.instruments.length > 0) {
            state.instruments.forEach(instrument => {
                prompt += `- ${instrument}: ${details.instruments[instrument] || 'No specific notes'}\n`;
            });
        } else {
            prompt += `(No instruments selected)\n`;
        }
    });

    prompt += `
---

Now, based on ALL of the above information, generate the complete and final Suno prompt.
Infer the professional mixing/mastering details ({...}) from the user's high-level notes and the overall genre/mood. Be creative and specific. For example, specify amp models for guitars, types of synth pads, drum machine models, compression ratios, and reverb lengths.
Ensure the final output is ONLY the formatted prompt and nothing else. Do not include any preamble, explanation, or markdown formatting.
`;

    return prompt;
};

export const generateSunoPrompt = async (state: AppState): Promise<string> => {
    const model = 'gemini-2.5-pro'; // Use a more powerful model for this complex task.
    const prompt = buildPrompt(state);

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating prompt with Gemini API:", error);
        throw new Error("Failed to generate prompt. Check your API key and try again.");
    }
};
