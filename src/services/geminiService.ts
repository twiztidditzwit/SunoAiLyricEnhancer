// Fix: Implemented the Gemini API service to generate lyrics.
import { GoogleGenAI } from "@google/genai";
import { LyricRequest } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getRhymeSchemeInstruction = (scheme: string): string => {
    switch (scheme) {
        case 'free-verse':
            return 'No specific rhyme scheme is required (Free Verse).';
        case 'chain-rhyme':
            return 'Follow a Chain Rhyme scheme, where a line from one stanza rhymes with a line in the next (e.g., ABA BCB CDC).';
        case 'aabb':
        case 'abab':
        case 'abcb':
        case 'abba':
        case 'aaaa':
        case 'aaba':
        case 'aabccb':
            return `Follow a ${scheme.toUpperCase()} rhyme scheme.`;
        default:
            return 'Follow the specified rhyme scheme.';
    }
};

const buildPrompt = (request: LyricRequest): string => {
    const { lyrics, style, story, settings } = request;
    const { mood, rhymeScheme, originality } = settings;

    let prompt = `You are an expert lyricist and songwriter's assistant. Your task is to refine and enhance a song concept.

Here is the initial concept:
`;

    if (lyrics) {
        prompt += `
**Draft Lyrics:**
---
${lyrics}
---
`;
    }

    if (style) {
        prompt += `
**Desired Style & Genre:** ${style}
`;
    }

    if (story) {
        prompt += `
**Story or Theme:** ${story}
`;
    }

    prompt += `
**Creative Constraints:**
- **Mood:** ${mood}
- **Rhyme Scheme:** ${getRhymeSchemeInstruction(rhymeScheme)}
- **Originality:** Aim for a level of originality that is ${originality.replace('-', ' ')}. Avoid cliches if "highly-original" is selected.

Based on all the provided information, please generate a new, complete set of lyrics.
The output should be only the lyrics, formatted with clear verse, chorus, and bridge sections where appropriate. Do not include any other explanatory text, preamble, or markdown formatting like \`\`\`.
`;

    return prompt;
};

export const generateLyrics = async (request: LyricRequest): Promise<string> => {
    const model = 'gemini-2.5-flash'; // Basic text task.
    const prompt = buildPrompt(request);

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        // Use the .text property to get the response text directly.
        return response.text.trim();

    } catch (error) {
        console.error("Error generating lyrics with Gemini API:", error);
        if (error instanceof Error) {
            return `An error occurred while generating lyrics: ${error.message}`;
        }
        return "An unknown error occurred while generating lyrics.";
    }
};