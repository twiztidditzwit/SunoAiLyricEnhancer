import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface OriginalityFeedbackProps {
    message: string | null;
}

const OriginalityFeedback: React.FC<OriginalityFeedbackProps> = ({ message }) => {
    if (!message) {
        return null;
    }

    return (
        <div className="mb-4 p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
                <LightbulbIcon />
            </div>
            <div>
                 <p className="text-yellow-300 font-semibold text-sm">AI Originality Tip</p>
                <p className="text-yellow-400 text-sm mt-1">{message}</p>
            </div>
        </div>
    );
};

export { OriginalityFeedback };
