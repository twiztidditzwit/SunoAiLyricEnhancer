import { GoogleGenAI, Type } from "@google/genai";
import { AppState, OriginalityScore } from "../types";

// Fix: Initialize the GoogleGenAI client correctly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (state: AppState): string => {
  let prompt = `Create a detailed and production-ready prompt for an AI music generator like Suno AI. The prompt should be enclosed in a single markdown code block.

Here are the details for the song:

**Core Idea:** ${state.coreIdea}
**Genre:** ${state.genre}
**Mood:** ${state.mood}
**Instrumentation:** ${state.instrumentation}
**Structure:** ${state.structure.join(', ')}
${state.lyrics ? `**Lyrics:**\n${state.lyrics}` : `**Lyrics:** The AI should generate creative and original lyrics based on the core idea. Avoid clichés and overused imagery like "neon lights," "city that never sleeps," "shattered glass," or "shadows dancing."`}
**Other Details:** ${state.otherDetails || 'None'}

Based on all this information, generate a single, cohesive prompt that an AI music generator can use to create a high-quality song. The prompt should describe the style, tempo, instrumentation, and vocal characteristics clearly. It should integrate the provided structure and lyrics seamlessly.`;

  return prompt;
};

export const generateSunoPrompt = async (state: AppState): Promise<string> => {
  try {
    const prompt = buildPrompt(state);
    const model = 'gemini-2.5-flash';

    // Fix: Use the correct method to generate content.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Fix: Extract text from the response correctly.
    const text = response.text.trim();
    
    // Extract content from markdown code block if present
    const match = text.match(/```(?:[\w-]+\n)?([\s\S]*?)```/);
    if (match && match[1]) {
      return match[1].trim();
    }

    return text;

  } catch (error) {
    console.error("Error generating Suno prompt:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};


export const analyzeOriginality = async (lyrics: string): Promise<OriginalityScore> => {
    if (!lyrics.trim()) {
        return { score: 0, explanation: 'No lyrics provided to analyze.' };
    }
    
    try {
        const prompt = `Analyze the following lyrics for originality. Provide a score from 0 to 100, where 100 is highly original and 0 is completely generic or plagiarized. Also provide a brief explanation for your score. 

        Lyrics to analyze:
        ---
        ${lyrics}
        ---
        `;

        const model = 'gemini-2.5-flash';
        
        // Fix: Use responseSchema when requesting a JSON response.
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.NUMBER,
                            description: "Originality score from 0 to 100."
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "Brief explanation for the score."
                        }
                    },
                    required: ['score', 'explanation']
                }
            }
        });
        
        // Fix: Extract text from the response correctly.
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (typeof result.score === 'number' && typeof result.explanation === 'string') {
            return result as OriginalityScore;
        } else {
            throw new Error('Invalid JSON structure in response.');
        }

    } catch (error) {
        console.error("Error analyzing originality:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze lyrics: ${error.message}`);
        }
        throw new Error("An unknown error occurred while analyzing lyrics.");
    }
}