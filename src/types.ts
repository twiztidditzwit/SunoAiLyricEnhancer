// Fix: Defined necessary TypeScript types for the application.
export type Mood = 'upbeat' | 'mellow' | 'introspective' | 'intense' | 'experimental';

export type RhymeScheme = 
    | 'free-verse'
    | 'aabb'
    | 'abab'
    | 'abcb'
    | 'abba'
    | 'aaaa'
    | 'aaba'
    | 'aabccb'
    | 'chain-rhyme';
    
export type Originality = 'conventional' | 'somewhat-original' | 'highly-original';

export interface Settings {
    mood: Mood;
    rhymeScheme: RhymeScheme;
    originality: Originality;
}

export interface LyricRequest {
    lyrics: string;
    style: string;
    story: string;
    settings: Settings;
}