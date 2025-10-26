import React from 'react';

interface CharacterCounterProps {
    current: number;
    max: number;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({ current, max }) => {
    const isOverLimit = current > max;
    const textColor = isOverLimit ? 'text-red-400' : 'text-content-200';

    return (
        <div className={`text-right text-sm transition-colors duration-300 ${textColor}`}>
            {current} / {max}
        </div>
    );
};

export { CharacterCounter };