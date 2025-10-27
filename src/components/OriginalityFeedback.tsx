import React, { useState, useEffect, useCallback } from 'react';
import { analyzeOriginality } from '../services/geminiService';
import { OriginalityScore } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';

// A simple debounce utility
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface Props {
  lyrics: string;
}

export const OriginalityFeedback: React.FC<Props> = ({ lyrics }) => {
  const [feedback, setFeedback] = useState<OriginalityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedLyrics = useDebounce(lyrics, 1500);

  const getFeedback = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 50) {
      setFeedback(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeOriginality(text);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get feedback.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getFeedback(debouncedLyrics);
  }, [debouncedLyrics, getFeedback]);

  const getScoreColor = (score: number) => {
    if (score > 75) return 'text-green-400';
    if (score > 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-4 bg-base-200/50 rounded-lg mt-2 text-sm">
      {isLoading && <div className="text-content-200">Analyzing originality...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {feedback && !isLoading && (
        <div className="flex items-start gap-3">
          <LightbulbIcon />
          <div>
            <h4 className="font-semibold text-content-100">Originality Feedback</h4>
            <p>
              Score: <span className={`font-bold ${getScoreColor(feedback.score)}`}>{feedback.score}/100</span>
            </p>
            <p className="text-content-200 mt-1">{feedback.explanation}</p>
          </div>
        </div>
      )}
      {!feedback && !isLoading && !error && lyrics.length > 0 && lyrics.length < 50 && (
        <div className="text-content-200 text-center py-2">
            Keep writing... originality feedback will appear here (min 50 characters).
        </div>
      )}
      {!feedback && !isLoading && !error && lyrics.length === 0 && (
        <div className="text-content-200 text-center py-2">
            Write some lyrics to get AI feedback on originality.
        </div>
      )}
    </div>
  );
};
