import { COSMIC_IMAGERY_KEYWORDS, IMAGERY_THRESHOLD, IMAGERY_FEEDBACK_MESSAGE } from '../constants';

/**
 * Scans a given text for overused cosmic or elemental imagery and returns a feedback message if a threshold is met.
 * @param text The combined text from lyrics, style, and story to analyze.
 * @returns A feedback string if overused imagery is detected, otherwise null.
 */
export const checkForOverusedImagery = (text: string): string | null => {
    // Create a single regex to find all keywords, case-insensitively, as whole words.
    // e.g. /\b(star|stars|starlight|...)\b/gi
    const regex = new RegExp(`\\b(${COSMIC_IMAGERY_KEYWORDS.join('|')})\\b`, 'gi');
    
    const matches = text.match(regex);
    
    if (matches && matches.length > IMAGERY_THRESHOLD) {
        return IMAGERY_FEEDBACK_MESSAGE;
    }

    return null;
};